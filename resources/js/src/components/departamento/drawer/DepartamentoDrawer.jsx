import { useEffect } from "react";
import { Drawer } from "@mantine/core";
import { DepartamentoServiciosForm } from "../../../components";
import {
    useDepartamentoStore,
    useServicioStore,
    useUiDepartamento,
} from "../../../hooks";
import { useForm } from "@mantine/form";

export const DepartamentoDrawer = () => {
    const {
        abrirDrawerServiciosDepartamento,
        fnDrawerAbrirServiciosDepartamento,
    } = useUiDepartamento();
    const { fnAsignarDepartamento } = useDepartamentoStore();
    const { fnCargarServiciosAgrupados, fnLimpiarServicios } =
        useServicioStore();

    const form = useForm({
        initialValues: {
            departamento_id: null,
            servicios: [],
        },
    });

    useEffect(() => {
        if (abrirDrawerServiciosDepartamento) {
            fnCargarServiciosAgrupados();
        }

        return () => {
            fnLimpiarServicios();
        };
    }, [abrirDrawerServiciosDepartamento]);

    const handleClose = () => {
        fnDrawerAbrirServiciosDepartamento(false);
        fnAsignarDepartamento(null);
        form.reset();
    };

    return (
        <Drawer
            opened={abrirDrawerServiciosDepartamento}
            onClose={handleClose}
            position="right"
            title="Servicios del Departamento"
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            size="lg"
        >
            <DepartamentoServiciosForm form={form} />
        </Drawer>
    );
};
