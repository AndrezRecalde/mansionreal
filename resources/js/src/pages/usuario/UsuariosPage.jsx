import { useEffect } from "react";
import { Container, Divider, Group } from "@mantine/core";
import {
    ActivarElementoModal,
    BtnSection,
    PrincipalSectionPage,
    ResetearPwdModal,
    UsuarioModal,
    UsuarioTable,
} from "../../components";
import { IconCubePlus, IconUserCircle } from "@tabler/icons-react";
import {
    useRoleStore,
    useTitleHook,
    useUiUsuario,
    useUsuarioStore,
} from "../../hooks";
import { PAGE_TITLE } from "../../helpers/getPrefix";
import Swal from "sweetalert2";

const UsuariosPage = () => {
    useTitleHook(PAGE_TITLE.USUARIOS.TITLE);
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
        fnAsignarUsuario(null);
        fnModalUsuario(true);
    };
    return (
        <Container size="xl" my={20}>
            <Group justify="space-between" mb={10}>
                <PrincipalSectionPage
                    title={PAGE_TITLE.USUARIOS.TITLE_PAGE}
                    description={PAGE_TITLE.USUARIOS.DESCRIPCION_PAGE}
                    icon={<IconUserCircle size={22} />}
                />
                <BtnSection
                    IconSection={IconCubePlus}
                    handleAction={handleNuevoHuesped}
                >
                    {PAGE_TITLE.USUARIOS.BUTTONS.NUEVO_USUARIO}
                </BtnSection>
            </Group>
            <Divider my={10} />
            <UsuarioTable PAGE_TITLE={PAGE_TITLE.USUARIOS} />

            <UsuarioModal PAGE_TITLE={PAGE_TITLE.USUARIOS} />
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
