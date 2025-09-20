import { Button, rem } from "@mantine/core";
import { IconChecks } from "@tabler/icons-react";

export const BtnSection = ({
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
}) => {
    return (
        <Button
            mt={mt}
            mb={mb}
            fullWidth={fullWidth}
            variant={variant}
            disabled={disabled}
            leftSection={<IconSection color={"#6d79f7"} />}
            styles={{
                root: {
                    "--button-height": rem(heigh),
                },
                inner: {
                    fontSize: fontSize,
                },
            }}
            onClick={handleAction}
        >
            {children}
        </Button>
    );
};

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
            color="indigo.8"
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
