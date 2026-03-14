import { Box, Group, ThemeIcon } from "@mantine/core";
import { TextSection, TitlePage } from "../../../components";

export const PrincipalSectionPage = ({ title, description, icon }) => {
    return (
        <Group mb="lg">
            <ThemeIcon size={40} radius="md" variant="light" color="indigo">
                {icon}
            </ThemeIcon>
            <Box>
                <TitlePage order={3}>{title}</TitlePage>
                <TextSection tt="" color="dimmed">
                    {description}
                </TextSection>
            </Box>
        </Group>
    );
};
