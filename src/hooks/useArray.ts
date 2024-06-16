import { useState } from "react";

type AppendHandler<T> = (data: T) => void;
type RemoveHandler = (index?: number) => void;
type UpdateHandler<T> = (data: T, index: number) => void;

interface UseArrayProps<T> {
  defaultValues?: T[];
}

interface UseArrayResult<T> {
  values: T[];
  append: AppendHandler<T>;
  remove: RemoveHandler;
  update: UpdateHandler<T>;
}

export default function useArray<T>(
  props: UseArrayProps<T> = {}
): UseArrayResult<T> {
  const [values, setValues] = useState<T[]>(props.defaultValues || []);

  const append: AppendHandler<T> = (data) => {
    setValues((preValues) => [...preValues, data]);
  };

  const remove: RemoveHandler = (index) => {
    if (typeof index === "number") {
      setValues((preValues) => [
        ...preValues.slice(0, index),
        ...preValues.slice(index + 1),
      ]);
    }
  };

  const update: UpdateHandler<T> = (data, index) => {
    setValues((preValues) => [
      ...preValues.slice(0, index),
      { ...data },
      ...preValues.slice(index + 1),
    ]);
  };

  return {
    values,
    append,
    remove,
    update,
  };
}
