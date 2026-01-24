import { useCallback, useMemo } from "react";
import { useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.cjs";
import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
import {
    BtnActivarElemento,
    ContenidoTable,
    MenuAcciones,
} from "../../../components";
import { useDepartamentoStore, useUiDepartamento } from "../../../hooks";
import { IconCategoryPlus, IconEdit } from "@tabler/icons-react";

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
        [departamentos],
    );

    const handleEditar = useCallback(
        (selected) => {
            //console.log("clic editar");
            fnAsignarDepartamento(selected);
            fnModalAbrirDepartamento(true);
        },
        [departamentos],
    );

    const handleActivar = useCallback(
        (selected) => {
            //console.log("clic activar");
            fnAsignarDepartamento(selected);
            fnModalAbrirActivarDepartamento(true);
        },
        [departamentos],
    );

    const handleServicios = useCallback(
        (selected) => {
            //console.log("clic activar");
            fnAsignarDepartamento(selected);
            fnDrawerAbrirServiciosDepartamento(true);
            //fnModalAbrirActivarDepartamento(true);
        },
        [departamentos],
    );

    const table = useMantineReactTable({
        columns,
        data: departamentos, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        state: { showProgressBars: cargando },
        localization: MRT_Localization_ES,
        enableFacetedValues: true,
        enableRowActions: true,
        enableStickyHeader: true,
        enableColumnPinning: true,
        initialState: {
            density: "md",
            columnPinning: { left: ["mrt-row-actions"] },
            sorting: [{ id: "numero_departamento", asc: true }],
        },
        mantineTableProps: {
            striped: true,
            highlightOnHover: true,
            withColumnBorders: true,
            withTableBorder: true,
        },
        renderRowActions: ({ row }) => (
            <MenuAcciones
                row={row}
                items={[
                    {
                        label: "Editar",
                        icon: IconEdit,
                        onClick: handleEditar,
                    },
                    {
                        label: "Servicios",
                        icon: IconCategoryPlus,
                        onClick: handleServicios,
                    },
                ]}
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
    });
    return <ContenidoTable table={table} />;
};
