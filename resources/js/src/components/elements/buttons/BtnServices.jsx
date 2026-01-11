import { Button, Menu, rem, useMantineTheme } from "@mantine/core";
import { IconChecks, IconChevronDown } from "@tabler/icons-react";
import { forwardRef } from "react";

export const BtnSection = forwardRef(
    (
        {
            variant = "default",
            disabled = false,
            fullWidth = false,
            heigh = 40,
            fontSize = 14,
            mb = 0,
            mt = 0,
            IconSection,
            handleAction,
            children,
            color,
            iconColor,
            iconSize = 20,
            iconStroke = 1.5,
            ...props
        },
        ref
    ) => {
        return (
            <Button
                ref={ref}
                mt={mt}
                mb={mb}
                fullWidth={fullWidth}
                variant={variant}
                disabled={disabled}
                color={color}
                leftSection={
                    IconSection && (
                        <IconSection
                            color={iconColor}
                            size={iconSize}
                            stroke={iconStroke}
                        />
                    )
                }
                styles={{
                    root: {
                        "--button-height": rem(heigh),
                    },
                    inner: {
                        fontSize: rem(fontSize),
                    },
                }}
                onClick={handleAction}
                {...props}
            >
                {children}
            </Button>
        );
    }
);

export const BtnSubmit = ({
    children,
    mt = "md",
    mb = "md",
    fullwidth = true,
    heigh = 45,
    fontSize = 18,
    IconSection = IconChecks,
    loading = false,
    disabled = false,
}) => {
    return (
        <Button
            //color="indigo.8"
            type="submit"
            fullWidth={fullwidth}
            mt={mt}
            mb={mb}
            rightSection={<IconSection />}
            disabled={disabled}
            loading={loading}
            loaderProps={{ type: "dots" }}
            styles={{
                root: {
                    "--button-height": rem(heigh),
                },
                inner: {
                    fontSize: fontSize,
                },
            }}
        >
            {children}
        </Button>
    );
};

export const BtnAddActions = ({
    heigh = 40,
    fontSize = 14,
    actions = [], // Lista de acciones dinámicas
    children,
}) => {
    const theme = useMantineTheme();

    return (
        <Menu
            transitionProps={{ transition: "pop-top-right" }}
            position="bottom-start"
            width={220}
            withinPortal
        >
            <Menu.Target>
                <Button
                    variant="default"
                    rightSection={
                        <IconChevronDown
                            style={{ width: rem(18), height: rem(18) }}
                            stroke={1.8}
                        />
                    }
                    pr={12}
                    styles={{
                        root: {
                            "--button-height": rem(heigh),
                        },
                        inner: {
                            fontSize: fontSize,
                        },
                    }}
                >
                    {children}
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                {actions.map(({ label, icon: Icon, onClick, color }, index) => (
                    <Menu.Item
                        key={index}
                        onClick={onClick}
                        leftSection={
                            <Icon
                                style={{ width: rem(18), height: rem(18) }}
                                color={
                                    theme.colors[color]?.[8] ||
                                    theme.colors.gray[8]
                                }
                                stroke={1.8}
                            />
                        }
                    >
                        {label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};
