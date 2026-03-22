import { useDocumentTitle } from "@mantine/hooks";

export const useTitleHook = (title = "Mansión Real") => {
    return useDocumentTitle(title);
};
