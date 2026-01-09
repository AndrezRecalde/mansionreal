import { useEffect } from "react";
import {
    Box,
    Checkbox,
    LoadingOverlay,
    PasswordInput,
    Stack,
    TextInput,
} from "@mantine/core";
import { AlertSection, BtnSubmit } from "../../components";
import { IconChevronsRight, IconInfoCircle } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useAuthStore } from "../../hooks";
import classes from "./modules/AuthForm.module.css";

export const AuthForm = () => {
    const { isLoading, startLogin, validate, errores } = useAuthStore();
    const form = useForm({
        initialValues: {
            dni: "",
            password: "",
            remember: false,
        },
    });

    useEffect(() => {
        if (validate !== undefined) {
            form.setErrors(validate);
            return;
        }
        return () => {
            form.clearErrors();
        };
    }, [validate]);

    const handleLogin = (e) => {
        e.preventDefault();
        startLogin(form.getValues());
    };

    return (
        <Box
            pos="relative"
            component="form"
            onSubmit={form.onSubmit((_, e) => handleLogin(e))}
            className={classes.formContainer}
        >
            <LoadingOverlay
                visible={isLoading}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            <Stack gap={{ base: "md", sm: "lg" }}>
                <TextInput
                    withAsterisk
                    label="Usuario"
                    placeholder="Digite su usuario"
                    size="md"
                    classNames={{
                        input: classes.input,
                        label: classes.label,
                    }}
                    {...form.getInputProps("dni")}
                />
                <PasswordInput
                    withAsterisk
                    label="Contraseña"
                    placeholder="Tu contraseña"
                    size="md"
                    classNames={{
                        input: classes.input,
                        label: classes.label,
                    }}
                    {...form.getInputProps("password")}
                />

                <Checkbox
                    label="Recuérdame"
                    size="sm"
                    className={classes.checkbox}
                />

                {errores ? (
                    <AlertSection
                        variant="light"
                        color="red.8"
                        icon={IconInfoCircle}
                        title="Error"
                        className={classes.alert}
                    >
                        {errores}
                    </AlertSection>
                ) : null}

                <BtnSubmit
                    heigh={50}
                    mb={0}
                    IconSection={IconChevronsRight}
                    className={classes.submitButton}
                >
                    Acceder
                </BtnSubmit>
            </Stack>
        </Box>
    );
};
