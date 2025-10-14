import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
import {
    BtnActivarElemento,
    ContenidoTable,
    MenuTable_DEPT,
} from "../../../components";
import { useDepartamentoStore, useUiDepartamento } from "../../../hooks";

export const DepartamentoTable = () => {
    const { cargando, departamentos, fnAsignarDepartamento } =
        useDepartamentoStore();
    const {
        fnModalAbrirDepartamento,
        fnModalAbrirActivarDepartamento,
        fnDrawerAbrirServiciosDepartamento,
    } = useUiDepartamento();

    // formateador de moneda
    const formatoMoneda = (valor) =>
        new Intl.NumberFormat("es-EC", {
            style: "currency",
            currency: "USD",
        }).format(valor);

    const columns = useMemo(
        () => [
            {
                header: "Número de Departamento",
                accessorKey: "numero_departamento", //normal accessorKey
                //filterVariant: "autocomplete",
            },
            {
                header: "Tipo de Departamento",
                accessorKey: "tipo_departamento",
            },
            {
                header: "Capacidad",
                accessorKey: "capacidad",
                size: 80,
            },
            {
                header: "Precio por Noche",
                accessorKey: "precio_noche",
                size: 80,
                Cell: ({ cell }) => formatoMoneda(cell.getValue()),
            },
            {
                header: "Total de servicios",
                accessorKey: "servicios_count",
                size: 80,
            },
            {
                id: "activo", //id is still required when using accessorFn instead of accessorKey
                header: "Activo",
                accessorKey: "activo",
                Cell: ({ cell }) => (
                    <BtnActivarElemento
                        cell={cell}
                        handleActivar={handleActivar}
                    />
                ),
                size: 80,
            },
        ],
        [departamentos]
    );

    const handleEditar = useCallback(
        (selected) => {
            console.log("clic editar");
            fnAsignarDepartamento(selected);
            fnModalAbrirDepartamento(true);
        },
        [departamentos]
    );

    const handleActivar = useCallback(
        (selected) => {
            console.log("clic activar");
            fnAsignarDepartamento(selected);
            fnModalAbrirActivarDepartamento(true);
        },
        [departamentos]
    );

    const handleServicios = useCallback(
        (selected) => {
            console.log("clic activar");
            fnAsignarDepartamento(selected);
            fnDrawerAbrirServiciosDepartamento(true);
            //fnModalAbrirActivarDepartamento(true);
        },
        [departamentos]
    );

    const table = useMantineReactTable({
        columns,
        data: departamentos, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        state: { showProgressBars: cargando },
        enableFacetedValues: true,
        enableRowActions: true,
        localization: MRT_Localization_ES,
        renderRowActionMenuItems: ({ row }) => (
            <MenuTable_DEPT
                row={row}
                handleEditar={handleEditar}
                handleServicios={handleServicios}
            />
        ),
        renderDetailPanel: ({ row }) => (
            <Carousel withIndicators height={200}>
                {row.original.imagenes?.map((img) => (
                    <Carousel.Slide key={img.id}>
                        <Image
                            src={`/storage/${img.imagen_url}`}
                            h={200}
                            fit="contain"
                        />
                    </Carousel.Slide>
                ))}
            </Carousel>
        ),
        mantineTableProps: {
            withColumnBorders: true,
            striped: true,
            withTableBorder: true,
            sx: {
                "thead > tr": {
                    backgroundColor: "inherit",
                },
                "thead > tr > th": {
                    backgroundColor: "inherit",
                },
                "tbody > tr > td": {
                    backgroundColor: "inherit",
                },
            },
        },
    });

    return <ContenidoTable table={table} />;
};
