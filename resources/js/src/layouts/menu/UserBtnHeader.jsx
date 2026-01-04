import cx from "clsx";
import { useMemo, useState } from "react";
import {
    Avatar,
    Divider,
    Group,
    Menu,
    UnstyledButton,
    rem,
} from "@mantine/core";
import { IconChevronDown, IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { TextSection } from "../../components";
import { NightModeSwitch } from "./NightModeSwitch";
import { menuProfile } from "../../routes/menuRoutes";
import { useAuthStore } from "../../hooks";
import { capitalizarCadaPalabra } from "../../helpers/fnHelper";
import classes from "./modules/UserHeader.module.css";

export const UserBtnHeader = ({ usuario }) => {
    const { startLogout } = useAuthStore();
    const [usuarioAbrirMenu, setUsuarioAbrirMenu] = useState(false);
    const navigate = useNavigate();

    const iniciales = useMemo(() => {
        if (!usuario) return "G"; // Valor predeterminado
        const primeraLetraNombre = usuario.nombres?.[0] ?? "";
        const primeraLetraApellido = usuario.apellidos?.[0] ?? "";
        return `${primeraLetraNombre}${primeraLetraApellido}` || "G";
    }, [usuario]);

    const getPrimerNombreApellido = (nombres = "", apellidos = "") => {
        // Cortamos nombres y apellidos en palabras
        const primerNombre = nombres.trim().split(" ")[0] || "";
        const primerApellido = apellidos.trim().split(" ")[0] || "";
        return `${primerNombre} ${primerApellido}`.trim();
    };

    const nombreCorto = useMemo(() => {
        if (!usuario) return "";
        return getPrimerNombreApellido(usuario.nombres, usuario.apellidos);
    }, [usuario]);

    const handleMenuClick = (linked) => {
        navigate(linked);
        /* if (toggleMobile) {
            toggleMobile(true);
        } */
    };

    return (
        <Menu
            width={320}
            shadow="md"
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUsuarioAbrirMenu(false)}
            onOpen={() => setUsuarioAbrirMenu(true)}
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton
                    className={cx(classes.user, {
                        [classes.userActive]: usuarioAbrirMenu,
                    })}
                    //aria-hidden={false}
                >
                    <Group gap={20}>
                        <Avatar
                            alt={iniciales}
                            variant="default"
                            radius="xl"
                            //color="teal.7"
                        >
                            {iniciales}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                            <TextSection tt="" fw={600} fz="sm">
                                {typeof nombreCorto === "string"
                                    ? capitalizarCadaPalabra(nombreCorto)
                                    : "Sin datos"}
                            </TextSection>
                            <TextSection fs="italic" fz={14} fw={700}>
                                {usuario?.role ?? "Sin datos"}
                            </TextSection>
                        </div>
                        <IconChevronDown
                            style={{ width: rem(20), height: rem(20) }}
                            stroke={1.5}
                        />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Group justify="space-between" p={20}>
                    <Avatar
                        alt={iniciales}
                        variant="default"
                        radius="xl"
                        //color="teal.7"
                        size="lg"
                    >
                        {iniciales}
                    </Avatar>
                    <div>
                        <TextSection tt="" fz={15} fw={500} size="sm">
                            {typeof nombreCorto === "string"
                                ? capitalizarCadaPalabra(nombreCorto)
                                : "Sin datos"}{" "}
                            <br />
                        </TextSection>
                        <TextSection tt="" fz={15} fs="italic" fw={700} size="sm">
                            {usuario?.role || "Sin datos"}
                        </TextSection>
                    </div>
                </Group>
                <Divider mb={10} />
                {menuProfile
                    .slice(0, -1)
                    .map(({ label, path, link, icon: Icon, color }) => (
                        <Menu.Item
                            key={path}
                            onClick={() => handleMenuClick(link)}
                            leftSection={
                                <Icon
                                    style={{ width: rem(20), height: rem(20) }}
                                    color={color}
                                    stroke={1.7}
                                />
                            }
                        >
                            {label}
                        </Menu.Item>
                    ))}

                <Menu.Label>Sesión</Menu.Label>
                <NightModeSwitch />
                <Menu.Item
                    onClick={startLogout}
                    color={menuProfile.at(-1).color}
                    leftSection={
                        <IconLogout
                            style={{ width: rem(18), height: rem(18) }}
                            stroke={1.5}
                        />
                    }
                >
                    {menuProfile.at(-1).label}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};
