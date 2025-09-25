import {
    Collapse,
    Group,
    Loader,
    rem,
    Select,
    SimpleGrid,
    TextInput,
    Transition,
} from "@mantine/core";
import { useHuespedStore, useProvinciaStore } from "../../../hooks";

export const ReservarDatosClienteForm = ({
    reservaForm,
    showDetails,
    disabledInput,
}) => {
    const { cargando } = useHuespedStore();
    const { provincias } = useProvinciaStore();
    return (
        <Transition
            mounted={showDetails || cargando}
            transition="slide-up"
            duration={350}
            timingFunction="ease"
        >
            {(styles) => (
                <div style={styles}>
                    <Collapse in={showDetails || cargando}>
                        <div>
                            {cargando ? (
                                <Group
                                    align="center"
                                    justify="center"
                                    style={{ minHeight: rem(120) }}
                                >
                                    <Loader size="lg" />
                                </Group>
                            ) : (
                                <SimpleGrid
                                    cols={{
                                        base: 1,
                                        xs: 1,
                                        sm: 1,
                                        md: 3,
                                        lg: 3,
                                    }}
                                    spacing="md"
                                >
                                    <TextInput
                                        withAsterisk
                                        disabled={disabledInput}
                                        label="Nombres"
                                        placeholder="Nombres"
                                        key={reservaForm.key("huesped.nombres")}
                                        {...reservaForm.getInputProps(
                                            "huesped.nombres"
                                        )}
                                    />
                                    <TextInput
                                        withAsterisk
                                        disabled={disabledInput}
                                        label="Apellidos"
                                        placeholder="Apellidos"
                                        key={reservaForm.key(
                                            "huesped.apellidos"
                                        )}
                                        {...reservaForm.getInputProps(
                                            "huesped.apellidos"
                                        )}
                                    />
                                    <TextInput
                                        withAsterisk
                                        disabled={disabledInput}
                                        label="Correo"
                                        placeholder="Correo"
                                        key={reservaForm.key("huesped.correo")}
                                        {...reservaForm.getInputProps(
                                            "huesped.email"
                                        )}
                                    />
                                    <TextInput
                                        disabled={disabledInput}
                                        label="Teléfono"
                                        placeholder="Teléfono"
                                        key={reservaForm.key(
                                            "huesped.telefono"
                                        )}
                                        {...reservaForm.getInputProps(
                                            "huesped.telefono"
                                        )}
                                    />
                                    <Select
                                        searchable
                                        clearable
                                        disabled={disabledInput}
                                        label="Provincia"
                                        placeholder="Provincia"
                                        data={provincias.map((provincia) => ({
                                            value: provincia.id.toString(),
                                            label: provincia.nombre_provincia,
                                        }))}
                                        key={reservaForm.key(
                                            "huesped.provincia_id"
                                        )}
                                        {...reservaForm.getInputProps(
                                            "huesped.provincia_id"
                                        )}
                                    />
                                    <TextInput
                                        disabled={disabledInput}
                                        label="Direccion del huesped"
                                        placeholder="Ingrese la direccion del huesped"
                                        key={reservaForm.key(
                                            "huesped.direccion"
                                        )}
                                        {...reservaForm.getInputProps(
                                            "huesped.direccion"
                                        )}
                                    />
                                </SimpleGrid>
                            )}
                        </div>
                    </Collapse>
                </div>
            )}
        </Transition>
    );
};
