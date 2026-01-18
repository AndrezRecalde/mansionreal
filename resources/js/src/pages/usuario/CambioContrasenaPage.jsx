import { Container, Divider } from "@mantine/core";
import { ContrasenaForm, TextSection, TitlePage } from "../../components";
import { useTitleHook, useUsuarioStore } from "../../hooks";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { PAGE_TITLE } from "../../helpers/getPrefix";

const CambioContrasenaPage = () => {
    useTitleHook(PAGE_TITLE.CAMBIO_CONTRASENA.TITLE);
    const usuario = JSON.parse(localStorage.getItem("service_user"));
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
                {PAGE_TITLE.CAMBIO_CONTRASENA.TITLE_PAGE}
            </TitlePage>
            <TextSection color="dimmed" tt="" fz={16} ta="center">
                {PAGE_TITLE.CAMBIO_CONTRASENA.DESCRIPCION_PAGE}
            </TextSection>
            <Divider my={20} />
            <ContrasenaForm usuario={usuario} />
        </Container>
    );
};

export default CambioContrasenaPage;
