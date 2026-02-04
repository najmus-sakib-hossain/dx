import { useMemo } from 'react';
import { CodeTab, PreviewTab, TabsLayout } from '../../components/common/TabsLayout';
import { Box, Button, ButtonGroup, Flex, Input, Text } from '@chakra-ui/react';

import OpenInStudioButton from '../../components/common/Preview/OpenInStudioButton';
import CodeExample from '../../components/code/CodeExample';
import useComponentProps from '../../hooks/useComponentProps';
import { ComponentPropsProvider } from '../../components/context/ComponentPropsContext';

import Customize from '../../components/common/Preview/Customize';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PropTable from '../../components/common/Preview/PropTable';
import BackgroundContent from '../../components/common/Preview/BackgroundContent';

import Squares from '../../content/Backgrounds/Squares/Squares';
import { squares } from '../../constants/code/Backgrounds/squaresCode';

const DEFAULT_PROPS = {
  direction: 'diagonal',
  borderColor: '#271E37',
  hoverColor: '#222222',
  size: 40,
  speed: 0.5
};

const SquaresDemo = () => {
  const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
  const { direction, borderColor, hoverColor, size, speed } = props;

  const propData = useMemo(
    () => [
      {
        name: 'direction',
        type: 'string',
        default: "'right'",
        description: "Direction of square animation. Options: 'diagonal', 'up', 'right', 'down', 'left'."
      },
      { name: 'speed', type: 'number', default: '1', description: 'Animation speed multiplier.' },
      { name: 'borderColor', type: 'string', default: "'#999'", description: 'Color of the square borders.' },
      { name: 'squareSize', type: 'number', default: '40', description: 'Size of individual squares in pixels.' },
      {
        name: 'hoverFillColor',
        type: 'string',
        default: "'#222'",
        description: 'Fill color when hovering over squares.'
      }
    ],
    []
  );

  return (
    <ComponentPropsProvider props={props} defaultProps={DEFAULT_PROPS} resetProps={resetProps} hasChanges={hasChanges}>
      <TabsLayout>
        <PreviewTab>
          <Box position="relative" h={600} className="demo-container" overflow="hidden" p={0}>
            <Squares
              squareSize={size}
              speed={speed}
              direction={direction}
              borderColor={borderColor}
              hoverFillColor={hoverColor}
            />

            {/* For Demo Purposes Only */}
            <BackgroundContent pillText="New Background" headline="Customizable squares moving around smoothly" />
          </Box>

          <Flex justify="flex-end" mt={2} mb={-2}>
            <OpenInStudioButton
              backgroundId="squares"
              currentProps={{
                speed,
                squareSize: size,
                direction,
                borderColor,
                hoverFillColor: hoverColor
              }}
              defaultProps={{
                speed: 0.5,
                squareSize: 40,
                direction: 'diagonal',
                borderColor: '#999',
                hoverFillColor: '#222'
              }}
            />
          </Flex>

          <Customize>
            <ButtonGroup isAttached size="sm">
              <Text fontSize="sm" mr={2}>
                Direction
              </Text>
              <Button
                bg={direction === 'diagonal' ? '#5227FF' : '#170D27'}
                _hover={{ backgroundColor: `${direction === 'diagonal' ? '#5227FF' : '#170D27'}` }}
                color="white"
                fontSize="xs"
                h={8}
                onClick={() => updateProp('direction', 'diagonal')}
              >
                Diagonal
              </Button>
              <Button
                bg={direction === 'up' ? '#5227FF' : '#170D27'}
                _hover={{ backgroundColor: `${direction === 'up' ? '#5227FF' : '#170D27'}` }}
                color="white"
                fontSize="xs"
                h={8}
                onClick={() => updateProp('direction', 'up')}
              >
                Up
              </Button>
              <Button
                bg={direction === 'right' ? '#5227FF' : '#170D27'}
                _hover={{ backgroundColor: `${direction === 'right' ? '#5227FF' : '#170D27'}` }}
                color="white"
                fontSize="xs"
                h={8}
                onClick={() => updateProp('direction', 'right')}
              >
                Right
              </Button>
              <Button
                bg={direction === 'down' ? '#5227FF' : '#170D27'}
                _hover={{ backgroundColor: `${direction === 'down' ? '#5227FF' : '#170D27'}` }}
                color="white"
                fontSize="xs"
                h={8}
                onClick={() => updateProp('direction', 'down')}
              >
                Down
              </Button>
              <Button
                bg={direction === 'left' ? '#5227FF' : '#170D27'}
                _hover={{ backgroundColor: `${direction === 'left' ? '#5227FF' : '#170D27'}` }}
                color="white"
                fontSize="xs"
                h={8}
                onClick={() => updateProp('direction', 'left')}
              >
                Left
              </Button>
            </ButtonGroup>

            <PreviewSlider
              min={10}
              max={100}
              step={1}
              value={size}
              title="Square Size"
              onChange={val => updateProp('size', val)}
            />

            <PreviewSlider
              min={0.1}
              max={2}
              step={0.01}
              value={speed}
              title="Animation Speed"
              onChange={val => updateProp('speed', val)}
            />

            <Flex alignItems="center" mb={6}>
              <Text mr={4}>Border Color</Text>
              <Input
                type="color"
                value={borderColor}
                onChange={e => updateProp('borderColor', e.target.value)}
                width="50px"
              />
            </Flex>

            <Flex alignItems="center" mb={6}>
              <Text mr={4}>Hover Color</Text>
              <Input
                type="color"
                value={hoverColor}
                onChange={e => updateProp('hoverColor', e.target.value)}
                width="50px"
              />
            </Flex>
          </Customize>

          <PropTable data={propData} />
        </PreviewTab>

        <CodeTab>
          <CodeExample codeObject={squares} componentName="Squares" />
        </CodeTab>
      </TabsLayout>
    </ComponentPropsProvider>
  );
};

export default SquaresDemo;
