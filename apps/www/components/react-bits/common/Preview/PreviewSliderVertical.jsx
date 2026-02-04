import { Box, Flex, Slider, Text } from '@chakra-ui/react';

const PreviewSliderVertical = ({
  title = '',
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  valueUnit = '',
  width = '100%',
  isDisabled = false,
  onChange
}) => {
  const handleChange = ({ value: next }) => onChange?.(next[0]);

  return (
    <Box my={4}>
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontSize="12px" color="#988BC7">
          {title}
        </Text>
        <Text fontSize="12px" color="#fff" fontFamily="mono">
          {typeof value === 'number' ? (step < 1 ? value.toFixed(2) : value.toFixed(0)) : value}
          {valueUnit}
        </Text>
      </Flex>
      <Slider.Root
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={handleChange}
        width={typeof width === 'number' ? `${width}px` : width}
        disabled={isDisabled}
      >
        <Slider.Control>
          <Slider.Track bg="#271E37" h="6px" borderRadius="3px">
            <Slider.Range bg="#5227FF" />
          </Slider.Track>
          <Slider.Thumb index={0} boxSize={4} bg="#fff" borderRadius="full" />
        </Slider.Control>
      </Slider.Root>
    </Box>
  );
};

export default PreviewSliderVertical;
