import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    ActivarElementoModal,
    BtnSection,
    ResetearPwdModal,
    TitlePage,
    UsuarioModal,
    UsuarioTable,
} from "../../components";
import { IconCubePlus } from "@tabler/icons-react";
import {
    useRoleStore,
    useTitleHook,
    useUiUsuario,
    useUsuarioStore,
} from "../../hooks";
import Swal from "sweetalert2";

const UsuariosPage = () => {
    useTitleHook("Usuarios - Mansión Real");
    const {
        fnCargarUsuarios,
        fnLimpiarUsuarios,
        activarUsuario,
        fnAsignarUsuario,
        fnCambiarStatus,
        mensaje,
        errores,
    } = useUsuarioStore();
    const {
        fnModalUsuario,
        abrirModalActivarUsuario,
        fnModalAbrirActivarUsuario,
    } = useUiUsuario();
    const { fnCargarRoles, fnLimpiarRoles } = useRoleStore();

    useEffect(() => {
        fnCargarUsuarios();
        fnCargarRoles();

        return () => {
            fnLimpiarUsuarios();
            fnLimpiarRoles();
        };
    }, []);

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

    const handleNuevoHuesped = () => {
        fnModalUsuario(true);
    };
    return (
        <Container size="xl" my={20}>
            <Group justify="space-between" mb={10}>
                <TitlePage order={2}>Usuarios del Sistema</TitlePage>
                <BtnSection
                    IconSection={IconCubePlus}
                    handleAction={handleNuevoHuesped}
                >
                    Nuevo Usuario
                </BtnSection>
            </Group>
            <Divider my={10} />
            <UsuarioTable />

            <UsuarioModal />
            <ResetearPwdModal />
            <ActivarElementoModal
                titulo="Activar Usuario"
                fnAbrirModal={fnModalAbrirActivarUsuario}
                abrirModal={abrirModalActivarUsuario}
                elementoActivado={activarUsuario}
                fnAsignarElementoActivado={fnAsignarUsuario}
                IconSection={IconCubePlus}
                fnHandleAction={fnCambiarStatus}
            />
        </Container>
    );
};

export default UsuariosPage;
