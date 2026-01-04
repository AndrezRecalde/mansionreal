import { Button, HoverCard, SimpleGrid, rem } from "@mantine/core";
import { IconCategoryPlus } from "@tabler/icons-react";
import { MenuQuick } from "./MenuLinks";

export const ConfiguracionMenu = ({ menuData, classes, theme }) => {
    return (
        <div
            style={{
                position: "fixed",
                bottom: rem(24),
                right: rem(24),
                zIndex: 9999,
            }}
        >
            <HoverCard
                width={250}
                position="top-end"
                radius="md"
                shadow="xl"
                withinPortal
                transitionProps={{ transition: "pop", duration: 200 }}
            >
                <HoverCard.Target>
                    <Button
                        size="lg"
                        radius="xl"
                        color="dark"
                        style={{
                            borderRadius: "50%",
                            width: rem(56),
                            height: rem(56),
                            padding: 0,
                        }}
                    >
                        <IconCategoryPlus size={28} />
                    </Button>
                </HoverCard.Target>

                <HoverCard.Dropdown
                    style={{ overflow: "hidden", padding: rem(8) }}
                >
                    <SimpleGrid cols={1} spacing="xs">
                        <MenuQuick
                            menuData={menuData}
                            classes={classes}
                            theme={theme}
                        />
                    </SimpleGrid>
                </HoverCard.Dropdown>
            </HoverCard>
        </div>
    );
};
