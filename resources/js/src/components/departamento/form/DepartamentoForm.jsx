import { useCallback, useEffect, useState } from "react";
import {
    ActionIcon,
    Box,
    FileInput,
    Group,
    Image,
    NumberInput,
    Pill,
    rem,
    Select,
    Stack,
    Textarea,
    TextInput,
} from "@mantine/core";
import { BtnSubmit } from "../../elements/buttons/BtnServices";
import { IconPhoto, IconTrash } from "@tabler/icons-react";
import { useDepartamentoStore, useTipoDepartamentoStore } from "../../../hooks";

export const DepartamentoForm = ({ form }) => {
    const { tiposDepartamentos } = useTipoDepartamentoStore();
    const { activarDepartamento, fnAgregarDepartamento } =
        useDepartamentoStore();
    const [imagenesExistentes, setImagenesExistentes] = useState([]);
    const [previewsNuevas, setPreviewsNuevas] = useState([]);
    const icon = (
        <IconPhoto style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
    );
    const convertToString = (value) =>
        value !== null && value !== undefined ? value.toString() : null;

    const ValueComponent = ({ value }) => {
        if (value === null) {
            return null;
        }

        if (Array.isArray(value)) {
            return (
                <Pill.Group>
                    {value.map((file, index) => (
                        <Pill key={index}>{file.name}</Pill>
                    ))}
                </Pill.Group>
            );
        }

        return <Pill>{value.name}</Pill>;
    };

    useEffect(() => {
        if (activarDepartamento) {
            const existentes = activarDepartamento.imagenes || [];
            setImagenesExistentes(existentes);
            form.setValues({
                ...activarDepartamento,
                numero_departamento: activarDepartamento.numero_departamento,
                tipo_departamento_id: convertToString(
                    activarDepartamento.tipo_departamento_id
                ),
                capacidad: activarDepartamento.capacidad,
                descripcion: activarDepartamento.descripcion || "",
                imagenes: [], // nuevas
            });
        }
    }, [activarDepartamento]);

    const handleImageChange = useCallback((files) => {
        if (files && files.length > 0) {
            const readers = Array.from(files).map(
                (file) =>
                    new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                    })
            );

            Promise.all(readers).then((results) => {
                setPreviewsNuevas(results);
            });
        } else {
            setPreviewsNuevas([]);
        }
    }, []);

    const eliminarImagenExistente = (id) => {
        setImagenesExistentes((prev) => prev.filter((img) => img.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Crear FormData
        const formData = new FormData();

        // 1️⃣ Campos normales
        const values = form.getTransformedValues();
        if (values.id) {
            formData.append("id", values.id);
        }
        formData.append("numero_departamento", values.numero_departamento);
        formData.append("tipo_departamento_id", values.tipo_departamento_id);
        formData.append("capacidad", values.capacidad);
        formData.append("precio_noche", values.precio_noche);
        formData.append("descripcion", values.descripcion);

        // 2️⃣ Imágenes existentes (IDs que se mantienen)
        // Se envía como array de IDs
        imagenesExistentes.forEach((img) => {
            formData.append("imagenesExistentes[]", img.id);
        });

        // 3️⃣ Imágenes nuevas (archivos)
        (values.imagenes || []).forEach((file) => {
            formData.append("imagenesNuevas[]", file);
        });

        // Enviar al backend
        fnAgregarDepartamento(formData);

        // Reset del form si lo deseas
        form.reset();
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="center"
                gap="md"
            >
                <TextInput
                    withAsterisk
                    label="Número de Departamento"
                    placeholder="Ingrese número de departamento"
                    {...form.getInputProps("numero_departamento")}
                />
                <Select
                    withAsterisk
                    label="Tipo de Departamento"
                    placeholder="Ingrese tipo de departamento"
                    data={tiposDepartamentos.map((tipo) => ({
                        value: tipo.id.toString(),
                        label: tipo.nombre_tipo,
                    }))}
                    searchable
                    nothingFoundMessage="No se encontraron tipos de departamentos"
                    {...form.getInputProps("tipo_departamento_id")}
                />
                <NumberInput
                    withAsterisk
                    label="Capacidad"
                    placeholder="Ingrese capacidad"
                    min={1}
                    {...form.getInputProps("capacidad")}
                />
                <Textarea
                    label="Descripción del Departamento"
                    resize="vertical"
                    autosize
                    minRows={3}
                    maxRows={6}
                    placeholder="Ingrese una descripción"
                    {...form.getInputProps("descripcion")}
                />
                <FileInput
                    clearable
                    withAsterisk
                    multiple
                    label="Imagenes del Departamento"
                    placeholder="Seleccione imagenes"
                    accept="image/png,image/jpeg,image/jpeg"
                    leftSection={icon}
                    valueComponent={ValueComponent}
                    {...form.getInputProps("imagenes")}
                    onChange={(files) => {
                        form.setFieldValue("imagenes", files);
                        handleImageChange(files);
                    }}
                />
                <Group mt="md">
                    {imagenesExistentes.map((img) => (
                        <div key={img.id} style={{ position: "relative" }}>
                            <Image
                                src={`/storage/${img.imagen_url}`}
                                alt={`imagen-${img.id}`}
                                fit="contain"
                                maw={100}
                            />
                            <ActionIcon
                                variant="filled"
                                color="red"
                                size="sm"
                                style={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    background: "rgba(255,255,255,0.8)",
                                }}
                                onClick={() => eliminarImagenExistente(img.id)}
                            >
                                <IconTrash size={16} />
                            </ActionIcon>
                        </div>
                    ))}
                </Group>

                {/* NUEVAS */}
                <Group mt="md">
                    {previewsNuevas.map((src, index) => (
                        <Image
                            key={index}
                            src={src}
                            alt={`nueva-${index}`}
                            fit="contain"
                            maw={100}
                        />
                    ))}
                </Group>
                <BtnSubmit>Guardar Departamento</BtnSubmit>
            </Stack>
        </Box>
    );
};
