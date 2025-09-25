import { useDispatch, useSelector } from "react-redux"
import { onSetStorageFields } from "../../store/storage/storageFieldsSlice";

export const useStorageField = () => {
  const { storageFields } = useSelector((state) => state.storageFields);

  const dispatch = useDispatch();

  const fnSetStorageFields = (data) => {
    dispatch(onSetStorageFields(data));
  }


  return {
    storageFields,

    fnSetStorageFields,
  }
}
