import { useRef, useMemo, useState, useCallback } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Flex,
  Icon,
  IconButton,
  Image,
  Kbd,
  Separator,
  Text,
  createListCollection
} from '@chakra-ui/react';
import {
  User2,
  HeartIcon,
  ArrowRight,
  MenuIcon,
  SearchIcon,
  X,
  ToolCase,
  Palette,
  Shapes,
  ImageIcon
} from 'lucide-react';
import { TbLibrary } from 'react-icons/tb';

import { useStars } from '../../hooks/useStars';

// Available tools for the hover menu
const TOOLS = [
  { id: 'background-studio', label: 'Background Studio', icon: Palette, path: '/tools/background-studio' },
  { id: 'shape-magic', label: 'Shape Magic', icon: Shapes, path: '/tools/shape-magic' },
  { id: 'texture-lab', label: 'Texture Lab', icon: ImageIcon, path: '/tools/texture-lab' }
];
import { useSearch } from '../context/SearchContext/useSearch';
import { useOptions } from '../context/OptionsContext/useOptions';
import FadeContent from '../../content/Animations/FadeContent/FadeContent';

import Logo from '../../assets/logos/react-bits-logo.svg';
import Star from '../../assets/common/star.svg';
import jsIcon from '../../assets/icons/js.svg';
import tsIcon from '../../assets/icons/ts.svg';
import cssIcon from '../../assets/icons/css.svg';
import twIcon from '../../assets/icons/tw.svg';

// ─── Constants ───────────────────────────────────────────────────────────────
const PREFS_CLOSE_DELAY = 150;
const GITHUB_URL = 'https://github.com/DavidHDev/react-bits';

const ICON_MAP = { JS: jsIcon, TS: tsIcon, CSS: cssIcon, TW: twIcon };

const BUTTON_STYLES = {
  bg: '#060010',
  border: '1px solid #271E37',
  transition: 'background 0.3s',
  _hover: { background: '#170D27' }
};

const OPTION_ROW_STYLES = {
  align: 'center',
  justify: 'space-between',
  px: 2,
  py: 2,
  borderRadius: '10px',
  _hover: { bg: '#170D27' },
  transition: 'background 0.15s'
};

// ─── Sub-components ──────────────────────────────────────────────────────────
const SearchButton = ({ onClick }) => (
  <Flex
    as="button"
    onClick={onClick}
    fontSize="12px"
    h={10}
    pr={2.5}
    pl={3}
    rounded="full"
    fontWeight={600}
    align="center"
    gap={1}
    cursor="pointer"
    userSelect="none"
    {...BUTTON_STYLES}
  >
    <Icon as={SearchIcon} boxSize={4} color="#392e4e" />
    <Text mr={8} color="#988BC7">
      Search...
    </Text>
    <Kbd
      color="#B19EEF"
      fontSize="10px"
      borderColor="#271E37"
      borderRadius="50px"
      w="20px"
      h="20px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor="#170D27"
      fontWeight={800}
    >
      /
    </Kbd>
  </Flex>
);

const ToolsLink = ({ isToolsPage, onMouseEnter, onMouseLeave, showMenu }) => {
  const linkTo = isToolsPage ? '/get-started/index' : '/tools';
  const linkIcon = isToolsPage ? TbLibrary : ToolCase;
  const linkText = isToolsPage ? 'Back to Docs' : 'Tools';

  return (
    <Box position="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Flex
        as={RouterLink}
        to={linkTo}
        fontSize="12px"
        h={10}
        px={3}
        rounded="full"
        fontWeight={600}
        align="center"
        gap={2}
        cursor="pointer"
        userSelect="none"
        textDecoration="none"
        _hover={{ textDecoration: 'none' }}
        {...BUTTON_STYLES}
      >
        <Icon as={linkIcon} boxSize={4} color="#B19EEF" />
        <Text color="#988BC7">{linkText}</Text>
        {!isToolsPage && (
          <Box
            fontSize="9px"
            fontWeight={700}
            color="#fff"
            bg="#5227FF"
            px={1.5}
            py={0.5}
            borderRadius="full"
            textTransform="uppercase"
            letterSpacing="0.5px"
            animation="pulse 2s ease-in-out infinite"
            sx={{
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.7, transform: 'scale(0.95)' }
              }
            }}
          >
            New
          </Box>
        )}
      </Flex>

      {!isToolsPage && <ToolsMenu isOpen={showMenu} />}
    </Box>
  );
};

const ToolsMenu = ({ isOpen }) => (
  <Box
    position="absolute"
    top="100%"
    left={0}
    pt={2}
    opacity={isOpen ? 1 : 0}
    visibility={isOpen ? 'visible' : 'hidden'}
    transform={isOpen ? 'translateY(0)' : 'translateY(-8px)'}
    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
    zIndex={1000}
  >
    <Box
      bg="#0D0716"
      border="1px solid #271E37"
      borderRadius="16px"
      p={1}
      minW="220px"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)"
    >
      <Flex direction="column" gap={1}>
        {TOOLS.map(tool => (
          <Flex
            key={tool.id}
            as={tool.comingSoon ? 'div' : RouterLink}
            to={tool.comingSoon ? undefined : tool.path}
            gap={2}
            p={2}
            borderRadius="12px"
            alignItems="center"
            cursor={tool.comingSoon ? 'not-allowed' : 'pointer'}
            opacity={tool.comingSoon ? 0.5 : 1}
            _hover={tool.comingSoon ? {} : { bg: '#170D27', textDecoration: 'none' }}
          >
            <Flex
              align="center"
              justify="center"
              w={7}
              h={7}
              borderRadius="8px"
              bg={tool.comingSoon ? '#271E37' : 'linear-gradient(135deg, #5227FF 0%, #7B4FFF 100%)'}
              boxShadow={tool.comingSoon ? 'none' : '0 2px 8px rgba(82, 39, 255, 0.4)'}
            >
              <Icon as={tool.icon} boxSize={4} color="#fff" />
            </Flex>
            <Flex direction="column" gap={0}>
              <Text fontSize="13px" color="#fff" fontWeight={500}>
                {tool.label}
              </Text>
              {tool.comingSoon && (
                <Text fontSize="10px" color="#988BC7">
                  Coming Soon
                </Text>
              )}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Box>
  </Box>
);

const OptionToggle = ({ items, value, onChange }) => (
  <Flex gap={1}>
    {items.map(item => (
      <Box
        key={item}
        as="button"
        onClick={() => onChange(item)}
        p={1.5}
        borderRadius="8px"
        bg={value === item ? '#271E37' : 'transparent'}
        border={value === item ? '1px solid #392e4e' : '1px solid transparent'}
        transition="all 0.15s"
        _hover={{ bg: '#271E37' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image src={ICON_MAP[item]} alt={item} boxSize={4} />
      </Box>
    ))}
  </Flex>
);

const PreferencesMenu = ({
  isOpen,
  langItems,
  styleItems,
  languagePreset,
  stylePreset,
  onLanguageChange,
  onStyleChange
}) => (
  <Box
    position="absolute"
    top="100%"
    right={0}
    pt={2}
    opacity={isOpen ? 1 : 0}
    visibility={isOpen ? 'visible' : 'hidden'}
    transform={isOpen ? 'translateY(0)' : 'translateY(-8px)'}
    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
    zIndex={1000}
  >
    <Box
      bg="#0D0716"
      border="1px solid #271E37"
      borderRadius="16px"
      p={3}
      minW="200px"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.4)"
    >
      <Text fontSize="12px" fontWeight={600} color="#988BC7" mb={1} px={1}>
        Preferences
      </Text>

      <Flex direction="column" gap={1}>
        <Flex {...OPTION_ROW_STYLES}>
          <Text fontSize="13px" color="#fff" fontWeight={500}>
            Language
          </Text>
          <OptionToggle items={langItems} value={languagePreset} onChange={onLanguageChange} />
        </Flex>

        <Flex {...OPTION_ROW_STYLES}>
          <Text fontSize="13px" color="#fff" fontWeight={500}>
            Styling
          </Text>
          <OptionToggle items={styleItems} value={stylePreset} onChange={onStyleChange} />
        </Flex>

        <Box h="1px" bg="#271E37" my={1} />

        <Flex
          gap={2}
          p={2}
          borderRadius="12px"
          alignItems="center"
          as={RouterLink}
          to="/favorites"
          _hover={{ bg: '#170D27', textDecoration: 'none' }}
        >
          <Flex align="center" justify="center" w={6} h={6} borderRadius="6px" bg="#5227FF">
            <Icon as={HeartIcon} color="#fff" boxSize={3} />
          </Flex>
          <Text fontSize="13px" color="#fff" fontWeight={500}>
            Favorites
          </Text>
        </Flex>
      </Flex>
    </Box>
  </Box>
);

const MobileDrawer = ({ isOpen, onClose, isToolsPage }) => (
  <Drawer.Root placement="top" open={isOpen} onOpenChange={onClose}>
    <Drawer.Backdrop zIndex={1000} mt="50px" />
    <Drawer.Positioner zIndex={1001} mt="50px" h="calc(100vh - 50px)">
      <Drawer.Content bg="#060010" h="100%" w="100vw">
        <Drawer.Body p={0}>
          <Flex direction="column">
            <Flex align="center" justify="space-between" h="57px" px={6} mb={6} borderBottom="1px solid #ffffff1c">
              <Image src={Logo} alt="Logo" h="25px" />
              <IconButton
                aria-label="Close Menu"
                size="md"
                onClick={onClose}
                bg="transparent"
                color="#B19EEF"
                _hover={{ bg: '#170D27' }}
              >
                <Icon as={X} boxSize={4} />
              </IconButton>
            </Flex>

            <Flex direction="column" px={6} gap={2}>
              <Text fontWeight="bold" color="#fff">
                Tools
              </Text>
              {TOOLS.map(tool => (
                <RouterLink
                  key={tool.id}
                  to={tool.comingSoon ? '#' : tool.path}
                  onClick={tool.comingSoon ? e => e.preventDefault() : onClose}
                  style={{
                    opacity: tool.comingSoon ? 0.5 : 1,
                    cursor: tool.comingSoon ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#988BC7'
                  }}
                >
                  <Icon as={tool.icon} boxSize={4} color="#B19EEF" />
                  {tool.label}
                  {tool.comingSoon && (
                    <Box as="span" fontSize="10px" color="#988BC7" fontWeight={600} ml={1}>
                      SOON
                    </Box>
                  )}
                </RouterLink>
              ))}

              <Separator my={4} borderColor="#271E37" />

              <Text fontWeight="bold" color="#fff">
                Useful Links
              </Text>

              {isToolsPage ? (
                <RouterLink to="/get-started/index" onClick={onClose} style={{ color: '#988BC7' }}>
                  Back to Docs
                </RouterLink>
              ) : (
                <RouterLink to="/get-started/index" onClick={onClose} style={{ color: '#988BC7' }}>
                  Back to Docs
                </RouterLink>
              )}

              <RouterLink to="/favorites" onClick={onClose} style={{ color: '#988BC7' }}>
                Favorites
              </RouterLink>

              <Separator my={4} borderColor="#271E37" />

              <Text fontWeight="bold" color="#fff">
                Other
              </Text>
              <RouterLink to={GITHUB_URL} target="_blank" onClick={onClose} style={{ color: '#988BC7' }}>
                GitHub <Icon boxSize={4} as={ArrowRight} transform="rotate(-45deg)" />
              </RouterLink>
              <RouterLink to="https://x.com/davidhdev" target="_blank" onClick={onClose} style={{ color: '#988BC7' }}>
                Who made this? <Icon boxSize={4} as={ArrowRight} transform="rotate(-45deg)" />
              </RouterLink>
            </Flex>
          </Flex>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Positioner>
  </Drawer.Root>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const Header = () => {
  const location = useLocation();
  const isToolsPage = location.pathname.startsWith('/tools');

  const langCollection = useMemo(() => createListCollection({ items: ['JS', 'TS'] }), []);
  const styleCollection = useMemo(() => createListCollection({ items: ['CSS', 'TW'] }), []);

  const { languagePreset, setLanguagePreset, stylePreset, setStylePreset } = useOptions();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { toggleSearch } = useSearch();
  const stars = useStars();

  const starCountRef = useRef(null);
  const prefsTimeoutRef = useRef(null);
  const toolsTimeoutRef = useRef(null);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const handlePrefsEnter = useCallback(() => {
    if (prefsTimeoutRef.current) clearTimeout(prefsTimeoutRef.current);
    setPrefsOpen(true);
  }, []);

  const handlePrefsLeave = useCallback(() => {
    prefsTimeoutRef.current = setTimeout(() => setPrefsOpen(false), PREFS_CLOSE_DELAY);
  }, []);

  const handleToolsEnter = useCallback(() => {
    if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current);
    setToolsOpen(true);
  }, []);

  const handleToolsLeave = useCallback(() => {
    toolsTimeoutRef.current = setTimeout(() => setToolsOpen(false), PREFS_CLOSE_DELAY);
  }, []);

  const openGitHub = useCallback(() => window.open(GITHUB_URL, '_blank'), []);

  return (
    <Box zIndex={100} className="main-nav">
      <Flex className="nav-items" h={20} alignItems="center" justifyContent="space-between" px={4}>
        <RouterLink to="/" className="logo">
          <Image src={Logo} alt="Logo" className="cursor-target" />
        </RouterLink>

        <IconButton
          aria-label="Open Menu"
          size="md"
          display={{ md: 'none' }}
          onClick={() => setDrawerOpen(true)}
          bg="transparent"
          color="#B19EEF"
          _hover={{ bg: '#170D27' }}
        >
          <MenuIcon size="1.3em" />
        </IconButton>

        <Flex display={{ base: 'none', md: 'flex' }} alignItems="center" gap={2}>
          <FadeContent blur>
            <ToolsLink
              isToolsPage={isToolsPage}
              onMouseEnter={handleToolsEnter}
              onMouseLeave={handleToolsLeave}
              showMenu={toolsOpen}
            />
          </FadeContent>

          <FadeContent blur>
            <SearchButton onClick={toggleSearch} />
          </FadeContent>

          <FadeContent blur>
            <Box position="relative" onMouseEnter={handlePrefsEnter} onMouseLeave={handlePrefsLeave}>
              <Flex
                as="button"
                align="center"
                justify="center"
                w={10}
                h={10}
                borderRadius="full"
                cursor="pointer"
                transition="all 0.2s"
                {...BUTTON_STYLES}
              >
                <Icon as={User2} boxSize={4} color="#B19EEF" />
              </Flex>

              <PreferencesMenu
                isOpen={prefsOpen}
                langItems={langCollection.items}
                styleItems={styleCollection.items}
                languagePreset={languagePreset}
                stylePreset={stylePreset}
                onLanguageChange={setLanguagePreset}
                onStyleChange={setStylePreset}
              />
            </Box>
          </FadeContent>

          <FadeContent blur>
            <button className="cta-button-docs" onClick={openGitHub}>
              Star On GitHub
              <span ref={starCountRef}>
                <img src={Star} alt="Star Icon" />
                {stars}
              </span>
            </button>
          </FadeContent>
        </Flex>
      </Flex>

      <MobileDrawer isOpen={isDrawerOpen} onClose={closeDrawer} isToolsPage={isToolsPage} />
    </Box>
  );
};

export default Header;
