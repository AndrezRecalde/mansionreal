import { Route, Routes } from "react-router-dom";
import { ErrorNotFound } from "../../pages";

export const RoutesNotFound = ({ children }) => {
    return (
        <Routes>
            {children}
            <Route path="*" element={<ErrorNotFound />} />
        </Routes>
    );
};
