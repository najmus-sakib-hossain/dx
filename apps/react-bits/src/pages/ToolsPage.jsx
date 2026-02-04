import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { ChevronDown, Palette, Shapes, ImageIcon, Info } from 'lucide-react';
import { useRef, useEffect, useState, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/navs/Header';
import AnnouncementBar from '../components/landing/AnnouncementBar/AnnouncementBar';
import ToolsShowcase from '../components/landing/ToolsShowcase/ToolsShowcase';
import '../tools/tools.css';
import Footer from '@/components/landing/Footer/Footer';
import Aurora from '@/content/Backgrounds/Aurora/Aurora';

const BackgroundStudio = lazy(() => import('../tools/background-studio/BackgroundStudio'));
const ShapeMagic = lazy(() => import('../tools/shape-magic/ShapeMagic'));
const TextureLab = lazy(() => import('../tools/texture-lab/TextureLab'));

const TOOLS = [
  {
    id: 'background-studio',
    label: 'Background Studio',
    icon: Palette,
    component: BackgroundStudio,
    description:
      'Explore animated backgrounds for your projects. Choose from various effects and customize as you like. Export as video, image, or code or share your creations as URLs.'
  },
  {
    id: 'shape-magic',
    label: 'Shape Magic',
    icon: Shapes,
    component: ShapeMagic,
    description:
      'Tool for automagically creating inner rounded corners between shapes of different sizes. Export as code or SVG.'
  },
  {
    id: 'texture-lab',
    label: 'Texture Lab',
    icon: ImageIcon,
    component: TextureLab,
    description:
      'Apply effects to your images and export the results. Add noise, dithering, halftone, ASCII art, and more. Save your presets for sharing or future use.'
  }
];

const ToolDropdown = ({ selectedTool, onSelect, isOpen, setIsOpen }) => {
  const dropdownRef = useRef(null);
  const infoRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const selected = TOOLS.find(t => t.id === selectedTool) || TOOLS[0];

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  useEffect(() => {
    const tooltip = document.createElement('div');
    tooltip.id = 'tool-info-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      background: #170D27;
      border: 1px solid #271E37;
      border-radius: 8px;
      padding: 8px 12px;
      width: 220px;
      font-size: 12px;
      color: #B19EEF;
      line-height: 1.5;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      z-index: 99999;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s, visibility 0.15s;
      font-family: inherit;
    `;
    document.body.appendChild(tooltip);
    tooltipRef.current = tooltip;
    return () => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    };
  }, []);

  useEffect(() => {
    if (tooltipRef.current && infoRef.current) {
      if (tooltipVisible) {
        const rect = infoRef.current.getBoundingClientRect();
        tooltipRef.current.textContent = selected.description;
        tooltipRef.current.style.top = `${rect.top}px`;
        tooltipRef.current.style.left = `${rect.right + 8}px`;
        tooltipRef.current.style.opacity = '1';
        tooltipRef.current.style.visibility = 'visible';
      } else {
        tooltipRef.current.style.opacity = '0';
        tooltipRef.current.style.visibility = 'hidden';
      }
    }
  }, [tooltipVisible, selected.description]);

  return (
    <Box position="relative" ref={dropdownRef}>
      {/* Animated rotating border */}
      <div className="tool-selector-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <Flex
          as="button"
          className="tool-selector-button"
          align="center"
          cursor="pointer"
          justify="space-between"
          w="100%"
        >
          <Flex align="center" gap={2.5}>
            <Flex
              align="center"
              justify="center"
              w={7}
              h={7}
              borderRadius="8px"
              bg="linear-gradient(135deg, #5227FF 0%, #7B4FFF 100%)"
              boxShadow="0 2px 8px rgba(82, 39, 255, 0.4)"
            >
              <Icon as={selected.icon} boxSize={4} color="#fff" />
            </Flex>
            <Text fontSize="14px" fontWeight={700} color="#fff" letterSpacing="-0.01em">
              {selected.label}
            </Text>
          </Flex>
          <Flex align="center" gap={1.5}>
            <div
              ref={infoRef}
              className="info-tooltip-trigger"
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              <Info size={14} color="#B19EEF" />
            </div>
            <Flex align="center" justify="center" w={6} h={6} borderRadius="6px" bg="#271E37">
              <Icon
                as={ChevronDown}
                boxSize={3.5}
                color="#B19EEF"
                transition="transform 0.2s"
                transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
              />
            </Flex>
          </Flex>
        </Flex>
      </div>

      <Box
        position="absolute"
        top="100%"
        left={0}
        right={0}
        mt={2}
        bg="#0D0716"
        border="1px solid #271E37"
        borderRadius="12px"
        overflow="hidden"
        opacity={isOpen ? 1 : 0}
        visibility={isOpen ? 'visible' : 'hidden'}
        transform={isOpen ? 'translateY(0)' : 'translateY(-8px)'}
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        zIndex={100}
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)"
      >
        {TOOLS.map(tool => (
          <Flex
            key={tool.id}
            as="button"
            onClick={() => {
              onSelect(tool.id);
              setIsOpen(false);
            }}
            align="center"
            gap={2.5}
            w="100%"
            px={3}
            py={2.5}
            bg={selectedTool === tool.id ? '#170D27' : 'transparent'}
            _hover={{ bg: '#170D27' }}
            transition="all 0.15s"
          >
            <Flex
              align="center"
              justify="center"
              w={6}
              h={6}
              borderRadius="8px"
              bg={selectedTool === tool.id ? 'linear-gradient(135deg, #5227FF 0%, #7B4FFF 100%)' : '#271E37'}
              transition="all 0.15s"
            >
              <Icon as={tool.icon} boxSize={3.5} color={selectedTool === tool.id ? '#fff' : '#B19EEF'} />
            </Flex>
            <Text fontSize="14px" fontWeight={selectedTool === tool.id ? 600 : 500} color="#fff">
              {tool.label}
            </Text>
            {!tool.component && (
              <Text fontSize="10px" color="#988BC7" fontWeight={600} ml="auto">
                SOON
              </Text>
            )}
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

const ComingSoon = ({ label, toolSelector }) => (
  <Flex h="100%" w="100%" gap={4} direction={{ base: 'column', lg: 'row' }}>
    {/* Controls Panel - shown on desktop */}
    <Box w="280px" flexShrink={0} display={{ base: 'none', lg: 'flex' }} flexDirection="column">
      {toolSelector && <Box mb={4}>{toolSelector}</Box>}
      <Text fontSize="13px" color="#988BC7">
        Settings will appear here when the tool is ready.
      </Text>
    </Box>

    {/* Preview Area */}
    <Flex
      flex={1}
      align="center"
      justify="center"
      direction="column"
      gap={3}
      borderRadius={{ base: '12px', lg: '16px' }}
      border="1px solid #271E37"
      bg="#0D0716"
      minH={{ base: '200px', lg: 'auto' }}
    >
      <Text fontSize={{ base: '20px', md: '24px' }} fontWeight={700} color="#fff">
        {label}
      </Text>
      <Text fontSize="14px" color="#988BC7">
        Coming soon...
      </Text>
    </Flex>
  </Flex>
);

const ToolContent = ({ toolId, toolSelector, mobileToolSelector }) => {
  const tool = TOOLS.find(t => t.id === toolId);

  if (!tool?.component) {
    return (
      <ComingSoon label={tool?.label || 'Tool'} toolSelector={toolSelector} mobileToolSelector={mobileToolSelector} />
    );
  }

  const Component = tool.component;
  return (
    <Suspense
      fallback={
        <Flex w="100%" h="100%" align="center" justify="center">
          <Text color="#988BC7">Loading...</Text>
        </Flex>
      }
    >
      <Component toolSelector={toolSelector} mobileToolSelector={mobileToolSelector} />
    </Suspense>
  );
};

export default function ToolsPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  useEffect(() => {
    if (!toolId) {
      document.title = 'React Bits - Tools';
    } else {
      const tool = TOOLS.find(t => t.id === toolId);
      if (tool) {
        document.title = `React Bits - ${tool.label}`;
      }
    }
  }, [toolId]);

  if (!toolId) {
    return (
      <Box minH="100vh" bg="#060010" display="flex" flexDirection="column">
        <AnnouncementBar
          message="React Bits Pro is coming: 65+ pro components, 100+ UI blocks, 5+ full templates. Click to join waitlist."
          link="https://pro.reactbits.dev"
          backgroundColor="linear-gradient(to right, #060010, #5227FF, #060010)"
          noBorder={true}
        />
        <Header />
        <Box pt={{ base: '100px', md: '120px' }} flex={1} position="relative" zIndex={1}>
          <ToolsShowcase />
        </Box>
        <Box position="relative" zIndex={1}>
          <Footer />
        </Box>

        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={0}
          opacity={0.5}
          transform={'rotate(180deg)'}
          pointerEvents="none"
        >
          <Aurora colorStops={['#3A0CA3', '#7209B7', '#4C1D95']} amplitude={0.8} blend={0.5} />
        </Box>
      </Box>
    );
  }

  const handleToolSelect = id => {
    navigate(`/tools/${id}`);
  };

  const selectedTool = TOOLS.find(t => t.id === toolId)?.id || 'background-studio';

  return (
    <Box h="100vh" bg="#060010" overflow="hidden">
      <AnnouncementBar
        message="React Bits Pro is coming: 65+ pro components, 100+ UI blocks, 5 full templates. Click to join waitlist."
        link="https://pro.reactbits.dev"
        backgroundColor="linear-gradient(to right, #060010, #5227FF, #060010)"
        noBorder={true}
      />
      <Header />

      <Box
        px={{ base: 3, md: 6 }}
        pt={{ base: '120px', md: '160px' }}
        pb={{ base: 3, md: 6 }}
        h="100vh"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {/* Mobile Tool Selector - shown at top on mobile */}
        <Box display={{ base: 'block', lg: 'none' }} mb={3} flexShrink={0}>
          <ToolDropdown
            selectedTool={selectedTool}
            onSelect={handleToolSelect}
            isOpen={isMobileDropdownOpen}
            setIsOpen={setIsMobileDropdownOpen}
          />
        </Box>

        {/* Tool content - full height, tool selector passed as prop */}
        <Box flex={1} overflow="hidden">
          <ToolContent
            toolId={selectedTool}
            toolSelector={
              <ToolDropdown
                selectedTool={selectedTool}
                onSelect={handleToolSelect}
                isOpen={isDropdownOpen}
                setIsOpen={setIsDropdownOpen}
              />
            }
          />
        </Box>
      </Box>
    </Box>
  );
}
