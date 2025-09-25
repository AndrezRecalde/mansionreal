import { useEffect } from "react";
import { Box, Card, Divider, Fieldset } from "@mantine/core";
import { useHuespedStore } from "../../../hooks";
import {
    ReservarBusquedaClienteForm,
    ReservarDatosClienteForm,
    TextSection,
} from "../../../components";

export const ReservarBusquedaClienteSection = ({
    reservaForm,
    showDetails,
    setShowDetails,
    disabledInput,
    handleSubmitHuesped,
}) => {
    const { activarHuesped, fnAsignarHuesped, cargando } = useHuespedStore();

    useEffect(() => {
        if (activarHuesped !== null) {
            reservaForm.setValues({
                huesped: {
                    huesped_id: activarHuesped.id,
                    nombres: activarHuesped.nombres,
                    apellidos: activarHuesped.apellidos,
                    dni: activarHuesped.dni,
                    email: activarHuesped.email,
                    telefono: activarHuesped.telefono || "",
                    direccion: activarHuesped.direccion || "",
                    provincia_id: activarHuesped.provincia_id
                        ? activarHuesped.provincia_id.toString()
                        : null,
                },
            });
            fnAsignarHuesped(activarHuesped);
            setShowDetails(true);
            return;
        }
        // eslint-disable-next-line
    }, [activarHuesped]);

    // Cuando se presiona Limpiar
    const handleClear = () => {
        reservaForm.setValues({
            huesped: {
                huesped_id: "",
                nombres: "",
                apellidos: "",
                dni: "",
                email: "",
                telefono: "",
                direccion: "",
                provincia_id: "",
            },
            departamento_id: "",
            fecha_checkin: "",
            fecha_checkout: "",
            total_noches: 0,
            total_pago: 0,
            total_adultos: 1,
            total_ninos: 0,
            total_mascotas: 0,
        });
        fnAsignarHuesped(null);
        setShowDetails(false);
    };

    return (
        <Fieldset
            legend={
                <TextSection tt="" fz={16} fw={300}>
                    Datos del Cliente
                </TextSection>
            }
        >
            <Card withBorder radius="sm" shadow="sm" p={15} mb={15}>
                <ReservarBusquedaClienteForm
                    reservaForm={reservaForm}
                    showDetails={showDetails}
                    disabledInput={disabledInput}
                    cargando={cargando}
                    handleSubmitHuesped={handleSubmitHuesped}
                    handleClear={handleClear}
                />
            </Card>
            <Divider my="xs" />
            <ReservarDatosClienteForm
                reservaForm={reservaForm}
                showDetails={showDetails}
                disabledInput={disabledInput}
            />
        </Fieldset>
    );
};
