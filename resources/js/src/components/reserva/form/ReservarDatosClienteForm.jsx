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
import { useHuespedStore } from "../../../hooks";

export const ReservarDatosClienteForm = ({
    reservaForm,
    showDetails,
    disabledInput,
    labelStyles,
}) => {
    const { cargando } = useHuespedStore();
    //const { provincias } = useProvinciaStore();
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
                                        classNames={labelStyles}
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
                                        classNames={labelStyles}
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
                                        classNames={labelStyles}
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
                                        classNames={labelStyles}
                                    />
                                    <Select
                                        searchable
                                        clearable
                                        disabled={disabledInput}
                                        label="Nacionalidad"
                                        placeholder="Nacionalidad"
                                        data={[
                                            {
                                                value: "ECUATORIANO",
                                                label: "ECUATORIANO",
                                            },
                                            {
                                                value: "EXTRANJERO",
                                                label: "EXTRANJERO",
                                            },
                                        ]}
                                        key={reservaForm.key(
                                            "huesped.nacionalidad"
                                        )}
                                        {...reservaForm.getInputProps(
                                            "huesped.nacionalidad"
                                        )}
                                        classNames={labelStyles}
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
                                        classNames={labelStyles}
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
