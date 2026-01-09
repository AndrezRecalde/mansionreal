import { Container, Divider } from "@mantine/core";
import { ContrasenaForm, TextSection, TitlePage } from "../../components";
import { useTitleHook, useUsuarioStore } from "../../hooks";
import { useEffect } from "react";
import Swal from "sweetalert2";

const CambioContrasenaPage = () => {
    useTitleHook("Mansión Real - Cambiar Contraseña");
    const { mensaje, errores } = useUsuarioStore();

    useEffect(() => {
        if (mensaje !== undefined) {
            Swal.fire({
                icon: mensaje.status,
                text: mensaje.msg,
                showConfirmButton: true,
            });
            return;
        }
    }, [mensaje]);

    useEffect(() => {
        if (errores !== undefined) {
            Swal.fire({
                icon: "error",
                text: errores,
                showConfirmButton: true,
            });
            return;
        }
    }, [errores]);

    return (
        <Container size={560} my={30}>
            <TitlePage order={2} ta="center">
                Cambiar Contraseña
            </TitlePage>
            <TextSection color="dimmed" tt="" fz={16} ta="center">
                Ingresa tu nueva contraseña y verificala.
            </TextSection>
            <Divider my={20} />
            <ContrasenaForm />
        </Container>
    );
};

export default CambioContrasenaPage;
