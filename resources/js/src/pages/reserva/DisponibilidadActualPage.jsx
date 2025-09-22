import { useEffect } from "react";
import { Container, Divider, Loader, Center } from "@mantine/core";
import {
    ConsumoModal,
    ConsumosDrawer,
    //DisponibilidadCards,
    DisponibilidadTable,
    FiltroDisponibilidad,
    GastoModal,
    ReservarDepartamentoModal,
    TitlePage,
} from "../../components";
import {
    useDepartamentoStore,
    useReservaDepartamentoStore,
    useTitleHook,
    useUiConsumo,
} from "../../hooks";
import Swal from "sweetalert2";

// DATA DE EJEMPLO
const categoriasEjemplo = [
    { id: 1, nombre: "Bebidas" },
    { id: 2, nombre: "Snacks" },
    { id: 3, nombre: "Limpieza" },
];

const inventariosEjemplo = [
    { id: 1, nombre: "Coca Cola", precio_unitario: 1.5, categoria_id: 1 },
    { id: 2, nombre: "Agua Mineral", precio_unitario: 1.0, categoria_id: 1 },
    { id: 3, nombre: "Papas Fritas", precio_unitario: 0.8, categoria_id: 2 },
    { id: 4, nombre: "Chocolate", precio_unitario: 1.2, categoria_id: 2 },
    { id: 5, nombre: "Jabón Líquido", precio_unitario: 2.5, categoria_id: 3 },
    { id: 6, nombre: "Desinfectante", precio_unitario: 3.0, categoria_id: 3 },
];

const DisponibilidadActualPage = () => {
    useTitleHook("Disponibilidad - Mansión Real");
    const { cargando, activarDepartamento, fnAsignarDepartamento } =
        useDepartamentoStore();
    const { fnConsultarDisponibilidadDepartamentos, fnLimpiarDepartamentos } =
        useDepartamentoStore();
    const {
        fnAbrirModalConsumo,
        abrirModalConsumo,
        fnAbrirDrawerConsumosDepartamento,
    } = useUiConsumo();

    const { mensaje, errores } = useReservaDepartamentoStore();

    useEffect(() => {
        fnConsultarDisponibilidadDepartamentos();
        return () => {
            //fnLimpiarDepartamentos();
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

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Disponibilidad Actual</TitlePage>
            <Divider my={10} />
            <FiltroDisponibilidad
                titulo="Buscar disponibilidad"
                fnHandleAction={fnConsultarDisponibilidadDepartamentos}
                cargando={cargando}
            />

            {cargando ? (
                <Center my={70}>
                    <Loader size="xl" />
                </Center>
            ) : (
                <DisponibilidadTable
                    setOpened={fnAbrirDrawerConsumosDepartamento}
                />
            )}

            <ReservarDepartamentoModal />
            <ConsumosDrawer
                activarElemento={activarDepartamento?.reserva?.id}
                fnAsignarElemento={fnAsignarDepartamento}
            />
            <ConsumoModal
                opened={abrirModalConsumo}
                onClose={() => fnAbrirModalConsumo(false)}
                categorias={categoriasEjemplo}
                inventarios={inventariosEjemplo}
                iva={12}
                onGuardarConsumo={(data) => {
                    console.log("Datos enviados al backend:", data);
                }}
            />
            <GastoModal />
        </Container>
    );
};

export default DisponibilidadActualPage;
