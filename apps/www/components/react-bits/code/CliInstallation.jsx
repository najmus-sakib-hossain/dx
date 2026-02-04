import {
  Text,
  Code,
  Stack,
  VStack,
  HStack,
  Flex,
  Button,
  Icon,
  Select,
  Box,
  Portal,
  Tooltip,
  createListCollection
} from '@chakra-ui/react';
import { TbCopy, TbCopyCheckFilled } from 'react-icons/tb';
import { useActiveRoute } from '../../hooks/useActiveRoute';
import { useOptions } from '../context/OptionsContext/useOptions';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { generateCliCommands } from '../../utils/cli';
import { useInstallation } from '../../hooks/useInstallation';

import jsrepoIcon from '../../assets/icons/jsrepo-outline.svg';
import shadcnIcon from '../../assets/icons/shadcn-outline.svg';

const PKG_MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'];

const CliInstallation = ({ deps }) => {
  const { category, subcategory } = useActiveRoute();
  const { languagePreset, stylePreset } = useOptions() || {};

  const {
    installMode: mode,
    setInstallMode: setMode,
    cliTool: cliLib,
    setCliTool: setCliLib,
    packageManager: pkg,
    setPackageManager: setPkg
  } = useInstallation();

  const commands = useMemo(
    () => generateCliCommands(languagePreset, stylePreset, category, subcategory, deps),
    [languagePreset, stylePreset, category, subcategory, deps]
  );

  const hasManual = !!commands?.manual;

  useEffect(() => {
    if (!hasManual && mode === 'manual') {
      setMode('cli');
    }
  }, [hasManual, mode, setMode]);

  const cliTools = useMemo(() => createListCollection({ items: ['shadcn', 'jsrepo'] }), []);
  const cliIconMap = { jsrepo: jsrepoIcon, shadcn: shadcnIcon };
  const cliLabelMap = { shadcn: 'shadcn', jsrepo: 'jsrepo' };

  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);
  const [scrollMeta, setScrollMeta] = useState({ w: 0, l: 0, show: false });
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const dragOffsetRef = useRef(0);
  const trackWidthRef = useRef(0);
  const thumbWidthRef = useRef(0);

  const currentCommand = useMemo(() => {
    if (!commands) return '';
    if (mode === 'manual') return commands.manual?.[pkg] || '';
    const key = pkg === 'npm' ? 'npx' : pkg;
    return cliLib === 'jsrepo' ? commands.jsrepo[key] : commands.shadcn[key];
  }, [commands, mode, pkg, cliLib]);

  const updateScrollMeta = useCallback(() => {
    const el = codeRef.current;
    if (!el) return;
    const { scrollWidth, clientWidth, scrollLeft } = el;
    if (scrollWidth <= clientWidth) {
      if (scrollMeta.show) setScrollMeta({ w: 0, l: 0, show: false });
      return;
    }
    const ratio = clientWidth / scrollWidth;
    const thumbWidth = Math.max(24, clientWidth * ratio);
    const maxTrack = clientWidth - thumbWidth;
    const thumbLeft = (scrollLeft / (scrollWidth - clientWidth)) * maxTrack;
    setScrollMeta({ w: thumbWidth, l: thumbLeft, show: true });
    trackWidthRef.current = clientWidth;
    thumbWidthRef.current = thumbWidth;
  }, [scrollMeta.show]);

  useEffect(() => {
    updateScrollMeta();
  }, [currentCommand, updateScrollMeta]);

  useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    const onScroll = () => updateScrollMeta();
    window.addEventListener('resize', updateScrollMeta);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', updateScrollMeta);
      el.removeEventListener('scroll', onScroll);
    };
  }, [updateScrollMeta]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = e => {
      const el = codeRef.current;
      const trackEl = trackRef.current;
      if (!el || !trackEl) return;
      const rect = trackEl.getBoundingClientRect();
      const maxThumbLeft = trackWidthRef.current - thumbWidthRef.current;
      let newLeft = e.clientX - rect.left - dragOffsetRef.current;
      newLeft = Math.max(0, Math.min(maxThumbLeft, newLeft));
      const scrollable = el.scrollWidth - el.clientWidth;
      const scrollLeft = (newLeft / maxThumbLeft) * scrollable;
      el.scrollLeft = scrollLeft;
      setScrollMeta(m => ({ ...m, l: newLeft }));
    };
    const handleUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp, { once: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging]);

  const handleScrollbarMouseDown = e => {
    const el = codeRef.current;
    const trackEl = trackRef.current;
    if (!el || !trackEl) return;
    const rect = trackEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const { l: thumbLeft, w: thumbWidth } = scrollMeta;
    const withinThumb = clickX >= thumbLeft && clickX <= thumbLeft + thumbWidth;
    if (withinThumb) {
      dragOffsetRef.current = clickX - thumbLeft;
    } else {
      const maxLeft = trackWidthRef.current - thumbWidth;
      let newLeft = clickX - thumbWidth / 2;
      newLeft = Math.max(0, Math.min(maxLeft, newLeft));
      const scrollable = el.scrollWidth - el.clientWidth;
      const scrollLeft = (newLeft / maxLeft) * scrollable;
      el.scrollLeft = scrollLeft;
      dragOffsetRef.current = clickX - newLeft;
      setScrollMeta(m => ({ ...m, l: newLeft }));
    }
    setDragging(true);
  };

  useEffect(() => {
    setCopied(false);
  }, [currentCommand]);

  const handleCopy = async () => {
    if (!currentCommand) return;
    try {
      await navigator.clipboard.writeText(currentCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // noop
    }
  };

  if (!commands) return null;

  const renderPkgButtons = () => (
    <div className="pkg-buttons" data-role="pkg-buttons">
      {PKG_MANAGERS.map(m => (
        <button key={m} className="cli-tool-tab" data-active={pkg === m} onClick={() => setPkg(m)}>
          {m}
        </button>
      ))}
    </div>
  );

  const CopyButton = (
    <Button
      position="absolute"
      h={10}
      top="50%"
      transform="translateY(-50%)"
      right=".6em"
      borderRadius="12px"
      fontWeight={500}
      backgroundColor={copied ? '#5227FF' : '#060010'}
      border="1px solid #392e4e"
      color={copied ? 'black' : 'white'}
      _hover={{ backgroundColor: copied ? '#5227FF' : '#170D27' }}
      _active={{ backgroundColor: '#5227FF' }}
      transition="background-color 0.3s ease"
      onClick={handleCopy}
      aria-label="Copy installation command"
    >
      {copied ? (
        <Icon as={TbCopyCheckFilled} color="#fff" boxSize={4} />
      ) : (
        <Icon as={TbCopy} color="#fff" boxSize={4} />
      )}
    </Button>
  );

  const manualSection = hasManual && (
    <VStack align="stretch" gap={0} fontFamily="mono" className="cli-install-section manual-mode">
      <div className="cli-row" data-row="manual">
        {renderPkgButtons()}
      </div>
      <div className="code-wrapper" style={{ position: 'relative' }}>
        <Code
          ref={mode === 'manual' ? codeRef : undefined}
          whiteSpace="pre"
          w="100%"
          onScroll={mode === 'manual' ? updateScrollMeta : undefined}
        >
          {commands.manual[pkg]}
        </Code>
        {scrollMeta.show && mode === 'manual' && (
          <div
            className={`cli-custom-scrollbar${dragging ? ' dragging' : ''}`}
            aria-hidden
            ref={trackRef}
            onMouseDown={handleScrollbarMouseDown}
          >
            <div
              className="cli-custom-scrollbar-thumb"
              style={{ width: scrollMeta.w, transform: `translateX(${scrollMeta.l}px)` }}
            />
          </div>
        )}
        {CopyButton}
      </div>
    </VStack>
  );

  const cliSection = (
    <VStack align="stretch" gap={0} fontFamily="mono" className="cli-install-section cli-mode">
      <div className="cli-row" data-row="cli">
        {renderPkgButtons()}
      </div>
      <div className="code-wrapper" style={{ position: 'relative' }}>
        <Code
          ref={mode === 'cli' ? codeRef : undefined}
          whiteSpace="pre"
          w="100%"
          onScroll={mode === 'cli' ? updateScrollMeta : undefined}
        >
          {cliLib === 'jsrepo'
            ? commands.jsrepo[pkg === 'npm' ? 'npx' : pkg]
            : commands.shadcn[pkg === 'npm' ? 'npx' : pkg]}
        </Code>
        {scrollMeta.show && mode === 'cli' && (
          <div
            className={`cli-custom-scrollbar${dragging ? ' dragging' : ''}`}
            aria-hidden
            ref={trackRef}
            onMouseDown={handleScrollbarMouseDown}
          >
            <div
              className="cli-custom-scrollbar-thumb"
              style={{ width: scrollMeta.w, transform: `translateX(${scrollMeta.l}px)` }}
            />
          </div>
        )}
        {CopyButton}
      </div>
    </VStack>
  );

  return (
    <div className="cli-install">
      <Text className="demo-title">Install</Text>
      <Stack my={2}>
        <Flex className="mode-switch" data-mode-switch w="100%" align="center" gap={0}>
          <HStack>
            <button data-active={mode === 'cli'} onClick={() => setMode('cli')} className="cli-toggle-button">
              CLI
            </button>
            {hasManual ? (
              <button
                data-active={mode === 'manual'}
                onClick={() => hasManual && setMode('manual')}
                className={`cli-toggle-button${!hasManual ? ' disabled' : ''}`}
                disabled={!hasManual}
                aria-disabled={!hasManual}
              >
                Manual
              </button>
            ) : (
              <Tooltip.Root openDelay={200} positioning={{ placement: 'right' }}>
                <Tooltip.Trigger asChild>
                  <span style={{ display: 'inline-block' }}>
                    <button
                      data-active={false}
                      className="cli-toggle-button disabled"
                      disabled
                      aria-disabled="true"
                      type="button"
                    >
                      Manual
                    </button>
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Positioner>
                  <Tooltip.Content
                    bg="#170d27"
                    border="1px solid #392e4e"
                    color="#c9c9c9"
                    fontSize="12px"
                    px={2}
                    whiteSpace="nowrap"
                    py={2}
                    borderRadius="8px"
                    textAlign="center"
                  >
                    No dependencies, head to the &quot;Code&quot; section
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Tooltip.Root>
            )}
          </HStack>
          {mode === 'cli' && (
            <Box ml="auto">
              <Select.Root
                collection={cliTools}
                value={[cliLib]}
                onValueChange={({ value }) => setCliLib(value[0])}
                size="sm"
                closeOnSelect={true}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger
                    cursor="pointer"
                    fontSize="14px"
                    h={10}
                    w="125px"
                    bg="#060010"
                    border="1px solid #392e4e"
                    rounded="15px"
                    px={3}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Select.ValueText display="flex" alignItems="center" gap={2}>
                      <img src={cliIconMap[cliLib]} alt={cliLib} style={{ width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#c9c9c9' }}>{cliLabelMap[cliLib]}</span>
                    </Select.ValueText>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Trigger>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content bg="#060010" border="1px solid #392e4e" borderRadius="15px" w="125px" px={2} py={2}>
                      {cliTools.items.map(tool => (
                        <Select.Item
                          key={tool}
                          item={tool}
                          fontSize="14px"
                          borderRadius="8px"
                          cursor="pointer"
                          py={1.5}
                          display="flex"
                          alignItems="center"
                          gap={2}
                          _highlighted={{ bg: '#271E37' }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <img src={cliIconMap[tool]} alt={tool} style={{ width: '20px', height: '20px' }} />
                            <Text fontSize="14px" fontWeight={600} color="#c9c9c9">
                              {cliLabelMap[tool]}
                            </Text>
                          </Box>
                          <Select.ItemIndicator display="flex" alignItems="center" ml="auto" mr={1}>
                            <Box boxSize={2} bg="#B19EEF" borderRadius="full" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </Box>
          )}
        </Flex>
        {hasManual && mode === 'manual' ? manualSection : cliSection}
      </Stack>
    </div>
  );
};

export default CliInstallation;
