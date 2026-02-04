import { Table, Box, Text } from '@chakra-ui/react';

const CodeCell = ({ content = '' }) => {
  return (
    <Box
      fontFamily="monospace"
      fontSize="10px"
      py="0.2em"
      px="0.6em"
      ml={2}
      borderRadius="5px"
      width="fit-content"
      fontWeight={500}
      color="#e9e9e9"
      backgroundColor="#271E37"
    >
      {content}
    </Box>
  );
};

const PropTable = ({ data }) => {
  return (
    <Box mt={12}>
      <h2 className="demo-title-extra">Props</h2>
      <Box overflowX="auto" mt={6}>
        <Table.Root variant="line" size="sm" className="props-table">
          <Table.Header borderBottom="1px solid #392e4e">
            <Table.Row backgroundColor="#170D27" borderRadius="20px">
              <Table.ColumnHeader
                letterSpacing="-.5px"
                borderRight="1px solid #392e4e"
                textTransform={'capitalize'}
                fontSize={'l'}
                p={4}
                color="white"
              >
                Property
              </Table.ColumnHeader>
              <Table.ColumnHeader
                letterSpacing="-.5px"
                borderRight="1px solid #392e4e"
                textTransform={'capitalize'}
                fontSize={'l'}
                p={4}
                color="white"
              >
                Type
              </Table.ColumnHeader>
              <Table.ColumnHeader
                letterSpacing="-.5px"
                borderRight="1px solid #392e4e"
                textTransform={'capitalize'}
                fontSize={'l'}
                p={4}
                color="white"
              >
                Default
              </Table.ColumnHeader>
              <Table.ColumnHeader letterSpacing="-.5px" textTransform={'capitalize'} fontSize={'l'} p={4} color="white">
                Description
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((prop, index) => (
              <Table.Row key={index} borderBottom={index === data.length - 1 ? 'none' : '1px solid #392e4e'}>
                <Table.Cell
                  borderColor="#271E37"
                  p={2}
                  color="white"
                  width={0}
                  borderRight="1px solid #392e4e"
                  bg={'#060010'}
                >
                  <CodeCell rightJustified content={prop.name} />
                </Table.Cell>
                <Table.Cell
                  borderColor="#271E37"
                  p={4}
                  color="white"
                  whiteSpace="nowrap"
                  fontSize="12px"
                  width={'120px'}
                  borderRight="1px solid #392e4e"
                  bg={'#060010'}
                >
                  <Text fontFamily="monospace" fontWeight={500}>
                    {prop.type}
                  </Text>
                </Table.Cell>
                <Table.Cell
                  borderColor="#271E37"
                  p={2}
                  color="white"
                  borderRight="1px solid #392e4e"
                  whiteSpace="nowrap"
                  bg={'#060010'}
                >
                  <CodeCell content={prop.default && prop.default.length ? prop.default : '—'} />
                </Table.Cell>
                <Table.Cell borderColor="#271E37" p={4} color="white" bg={'#060010'} fontSize="12px">
                  <Text maxW={300}>{prop.description}</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
};

export default PropTable;
