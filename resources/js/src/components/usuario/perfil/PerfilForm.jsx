import { Box, LoadingOverlay, Stack, Text } from "@mantine/core";
import React from "react";

export const PerfilForm = () => {
    return (
        <Box
            pos="relative"
            component="form"
            onSubmit={form.onSubmit((_, e) => handleLogin(e))}
        >
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            <Stack>
                <Text fz="xs" tt="uppercase" fw={700} className={classes.title}>
                    Nombres
                </Text>
                <Text fz="lg" fw={500} className={classes.stats}>
                    Cristhian Andres Recalde Solano
                </Text>
            </Stack>
        </Box>
    );
};
