import {
    ActionIcon,
    Box,
    CopyButton,
    Divider,
    Flex,
    PasswordInput,
    Stack,
    Tooltip,
} from "@mantine/core";
import { TextSection, AlertSection, BtnSubmit } from "../../../components";
import { IconAlertCircle, IconCheck, IconUserScan } from "@tabler/icons-react";
import { useUiUsuario, useUsuarioStore } from "../../../hooks";
import { useEffect, useState } from "react";

export const ResetearPwdForm = ({ form }) => {
    const { password } = form.values;
    const { activarUsuario, fnCambiarPassword } = useUsuarioStore();
    const { fnModalResetearPwd } = useUiUsuario();
    const [btnDisabled, setBtnDisabled] = useState(true);

    useEffect(() => {
        if (activarUsuario !== null) {
            form.setValues({
                ...activarUsuario,
            });
            return;
        }
    }, [activarUsuario]);

    useEffect(() => {
        if (password === activarUsuario?.dni) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [password]);

    const handleSubmit = () => {
        fnCambiarPassword(form.values);
        //console.log(form.values);
        fnModalResetearPwd(false);
        form.reset();
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Stack>
                <Flex
                    mih={30}
                    gap="md"
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="wrap"
                >
                    <CopyButton value={activarUsuario?.dni} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip
                                label={copied ? "Copiado" : "Copiar"}
                                withArrow
                                position="right"
                            >
                                <ActionIcon
                                    color={copied ? "indigo.5" : "gray"}
                                    onClick={() => {
                                        form.setFieldValue(
                                            "password",
                                            activarUsuario?.dni
                                        );
                                        form.setFieldValue(
                                            "password_confirmation",
                                            activarUsuario?.dni
                                        );
                                    }}
                                    size="xl"
                                    variant="transparent"
                                >
                                    {copied ? (
                                        <IconCheck size={50} />
                                    ) : (
                                        <IconUserScan size={50} stroke={1.5} />
                                    )}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                    <TextSection tt="" fw={500} fz={18}>
                        {activarUsuario?.apellidos + " " + activarUsuario?.nombres}
                    </TextSection>
                </Flex>
                <AlertSection
                    mt={0}
                    mb={0}
                    variant="light"
                    color="yellow.7"
                    title="¡Información!"
                    icon={IconAlertCircle}
                >
                    Por favor dar clic en el icono de la parte superior para
                    continuar con el reseteo de contraseña.
                </AlertSection>
                <PasswordInput
                    data-autofocus
                    disabled
                    label="Contraseña"
                    placeholder="Se debe realizar clic en el Botón superior"
                    {...form.getInputProps("password")}
                />
                <Divider />
                <BtnSubmit disabled={btnDisabled}>
                    Resetear contraseña
                </BtnSubmit>
            </Stack>
        </Box>
    );
};
