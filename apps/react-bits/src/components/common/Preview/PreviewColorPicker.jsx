import { Flex, Text, Input } from '@chakra-ui/react';

const PreviewColorPicker = ({ title = '', color = '#ffffff', setColor }) => {
  const handleChange = e => {
    setColor?.(e.target.value);
  };

  return (
    <Flex gap="4" align="center" mt="4">
      <Text fontSize="14px">{title}</Text>
      <Flex align="center" gap="2">
        <Input
          type="color"
          value={color}
          onChange={handleChange}
          w="40px"
          h="36px"
          p="0"
          border="1px solid #392e4e"
          borderRadius="8px"
          cursor="pointer"
          bg="transparent"
          _hover={{ borderColor: '#5a4b7a' }}
        />
        <Input
          type="text"
          value={color}
          onChange={handleChange}
          w="90px"
          h="36px"
          bg="#060010"
          border="1px solid #392e4e"
          borderRadius="10px"
          fontSize="13px"
          fontFamily="mono"
          textTransform="lowercase"
        />
      </Flex>
    </Flex>
  );
};

export default PreviewColorPicker;
