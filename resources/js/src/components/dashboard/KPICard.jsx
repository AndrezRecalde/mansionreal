import { Card, Text, Group } from '@mantine/core';

export default function KPICard({ label, value, color }) {
  return (
    <Card radius="md" shadow="sm" withBorder>
      <Group wrap="nowrap" spacing="xs">
        <Text size="sm" c="dimmed">{label}</Text>
        <Text size="xl" fw={700} c={color}>{value}</Text>
      </Group>
    </Card>
  );
}
