import { Text } from "@mantine/core";

export const TextSection = ({
    color = "",
    tt = "uppercase",
    td = "",
    fw,
    fz = 14,
    ta = "left",
    children,
    fs = "",
    mb = 0,
    mt = 0
}) => {
    return (
        <Text c={color} fz={fz} tt={tt} td={td} ta={ta} fw={fw} fs={fs} mb={mb} mt={mt}>
            {children}
        </Text>
    );
};
