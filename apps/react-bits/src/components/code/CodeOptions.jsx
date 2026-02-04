import { Children, useMemo } from 'react';
import { Select, Flex, Text, Icon, Box, Portal, createListCollection } from '@chakra-ui/react';
import { useOptions } from '../context/OptionsContext/useOptions';
import { TbMoodSad } from 'react-icons/tb';

import jsIcon from '../../assets/icons/js.svg';
import tsIcon from '../../assets/icons/ts.svg';
import cssIcon from '../../assets/icons/css.svg';
import twIcon from '../../assets/icons/tw.svg';

export const CSS = ({ children }) => <>{children}</>;
export const Tailwind = ({ children }) => <>{children}</>;
export const TSCSS = ({ children }) => <>{children}</>;
export const TSTailwind = ({ children }) => <>{children}</>;

const CodeOptions = ({ children }) => {
  const { languagePreset, setLanguagePreset, stylePreset, setStylePreset } = useOptions();
  const currentLang = languagePreset || 'JS';

  const buckets = { JS: { css: null, tailwind: null }, TS: { css: null, tailwind: null } };
  Children.forEach(children, child => {
    if (!child) return;
    if (child.type === CSS) buckets.JS.css = child;
    if (child.type === Tailwind) buckets.JS.tailwind = child;
    if (child.type === TSCSS) buckets.TS.css = child;
    if (child.type === TSTailwind) buckets.TS.tailwind = child;
  });

  const renderContent = variant => {
    const node = currentLang === 'JS' ? buckets.JS[variant] : buckets.TS[variant];
    return node?.props?.children ? (
      node
    ) : (
      <Flex alignItems="center" gap={1} my={6} color="#a1a1aa">
        <Text>Sorry, this combination is not supported</Text>
        <Icon as={TbMoodSad} />
      </Flex>
    );
  };

  const langCollection = useMemo(() => createListCollection({ items: ['JS', 'TS'] }), []);
  const styleCollection = useMemo(() => createListCollection({ items: ['CSS', 'TW'] }), []);

  const iconMap = { JS: jsIcon, TS: tsIcon, CSS: cssIcon, TW: twIcon };
  const colorMap = { JS: '#F7DF1E', TS: '#3178C6', CSS: '#B19EEF', TW: '#38BDF8' };
  const labelMap = { JS: 'JavaScript', TS: 'TypeScript', CSS: 'CSS', TW: 'Tailwind' };

  const LanguageSelect = (
    <Select.Root
      collection={langCollection}
      value={[currentLang]}
      onValueChange={({ value }) => setLanguagePreset(value[0])}
      size="sm"
      closeOnSelect={false}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger
          cursor="pointer"
          fontSize="14px"
          h={10}
          w="150px"
          bg="#060010"
          border="1px solid #392e4e"
          rounded="15px"
          px={3}
        >
          <Select.ValueText fontSize="13px" display="flex" alignItems="center" gap={2}>
            {currentLang && (
              <>
                <img src={iconMap[currentLang]} alt={currentLang} style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#c9c9c9' }}>{labelMap[currentLang]}</span>
              </>
            )}
          </Select.ValueText>
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content bg="#060010" border="1px solid #392e4e" borderRadius="15px" w="150px" px={2} py={2}>
            {langCollection.items.map(lang => (
              <Select.Item
                key={lang}
                item={lang}
                fontSize="14px"
                borderRadius="8px"
                cursor="pointer"
                py={1.5}
                display="flex"
                alignItems="center"
                gap={2}
                _highlighted={{ bg: '#271E37' }}
              >
                <Flex align="center" gap={2}>
                  <img src={iconMap[lang]} alt={lang} style={{ width: '20px', height: '20px' }} />
                  <Text fontSize="14px" fontWeight={600} color="#c9c9c9">
                    {labelMap[lang]}
                  </Text>
                </Flex>
                <Select.ItemIndicator display="flex" alignItems="center" ml="auto" mr={1}>
                  <Box boxSize={2} bg={colorMap[lang]} borderRadius="full" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );

  const StyleSelect = (
    <Select.Root
      collection={styleCollection}
      value={[stylePreset]}
      onValueChange={({ value }) => setStylePreset(value[0])}
      size="sm"
      closeOnSelect={false}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger
          cursor="pointer"
          fontSize="14px"
          h={10}
          w="135px"
          bg="#060010"
          border="1px solid #392e4e"
          rounded="15px"
          px={3}
        >
          <Select.ValueText fontSize="13px" display="flex" alignItems="center" gap={2}>
            {stylePreset && (
              <>
                <img src={iconMap[stylePreset]} alt={stylePreset} style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#c9c9c9' }}>{labelMap[stylePreset]}</span>
              </>
            )}
          </Select.ValueText>
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content bg="#060010" border="1px solid #392e4e" borderRadius="16px" w="135px" px={2} py={2}>
            {styleCollection.items.map(s => (
              <Select.Item
                key={s}
                item={s}
                fontSize="14px"
                borderRadius="8px"
                cursor="pointer"
                display="flex"
                py={1.5}
                alignItems="center"
                gap={2}
                _highlighted={{ bg: '#271E37' }}
              >
                <Flex align="center" gap={2}>
                  <img src={iconMap[s]} alt={s} style={{ width: '20px', height: '20px' }} />
                  <Text fontSize="14px" fontWeight={600} color="#c9c9c9">
                    {labelMap[s]}
                  </Text>
                </Flex>
                <Select.ItemIndicator display="flex" alignItems="center" ml="auto" mr={1}>
                  <Box boxSize={2} bg={colorMap[s]} borderRadius="full" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );

  const styleVariant = stylePreset === 'TW' ? 'tailwind' : 'css';

  return (
    <Box mt={0} w="100%">
      <Flex mb={2} w="100%" alignItems="center" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>
          {LanguageSelect}
          {StyleSelect}
        </Box>
      </Flex>
      <Box>{renderContent(styleVariant)}</Box>
    </Box>
  );
};

export default CodeOptions;
