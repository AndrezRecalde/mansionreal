import { useEffect } from "react";
import { Card, Divider, Fieldset } from "@mantine/core";
import {
    useConfiguracionIvaStore,
    useHuespedStore,
    useReservaDepartamentoStore,
} from "../../../hooks";
import {
    AlertSection,
    ReservarBusquedaClienteForm,
    ReservarDatosClienteForm,
    TextSection,
} from "../../../components";
import { IconAlertCircle } from "@tabler/icons-react";

export const ReservarBusquedaClienteSection = ({
    reservaForm,
    showDetails,
    setShowDetails,
    disabledInput,
    handleSubmitHuesped,
}) => {
    const { nacionalidad } = reservaForm.values.huesped;
    const { activarHuesped, fnAsignarHuesped, cargando } = useHuespedStore();
    const { activarTipoReserva } = useReservaDepartamentoStore();
    const { fnCargarConfiguracionIvaActiva, fnAsignarIva } =
        useConfiguracionIvaStore();

    useEffect(() => {
        if (activarHuesped !== null) {
            console.log(activarTipoReserva);
            reservaForm.setValues({
                huesped: {
                    huesped_id: activarHuesped.id,
                    nombres: activarHuesped.nombres,
                    apellidos: activarHuesped.apellidos,
                    dni: activarHuesped.dni,
                    email: activarHuesped.email,
                    telefono: activarHuesped.telefono || "",
                    direccion: activarHuesped.direccion || "",
                    nacionalidad: activarHuesped.nacionalidad || "",
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
                nacionalidad: "",
            },
            tipo_reserva: activarTipoReserva,
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

    useEffect(() => {
        nacionalidad === "ECUATORIANO"
            ? fnCargarConfiguracionIvaActiva()
            : fnAsignarIva(0);

        return () => {
            fnAsignarIva(null);
        };
    }, [nacionalidad]);

    return (
        <Fieldset
            legend={
                <TextSection tt="" fz={16} fw={300}>
                    Datos del Cliente
                </TextSection>
            }
        >
            <>
                {nacionalidad ? (
                    <AlertSection
                        variant="light"
                        color="teal.7"
                        icon={IconAlertCircle}
                        title="Atención"
                    >
                        <TextSection tt="" fz={12} fw={300}>
                            El cliente tiene una nacionalidad {nacionalidad}{" "}
                            {nacionalidad === "ECUATORIANO"
                                ? "Esta obligado a pagar la tasa de IVA fijada correspondiente al Ecuador"
                                : "No está obligado a pagar la tasa de IVA"}
                        </TextSection>
                    </AlertSection>
                ) : null}
                <ReservarBusquedaClienteForm
                    reservaForm={reservaForm}
                    showDetails={showDetails}
                    disabledInput={disabledInput}
                    cargando={cargando}
                    handleSubmitHuesped={handleSubmitHuesped}
                    handleClear={handleClear}
                />
            </>
            <ReservarDatosClienteForm
                reservaForm={reservaForm}
                showDetails={showDetails}
                disabledInput={disabledInput}
            />
        </Fieldset>
    );
};
