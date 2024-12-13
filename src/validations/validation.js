import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import * as yup from "yup";

export const loginSchema = yup
  .object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
  })
  .required();

  export const RoleSchema = yup.object({
    name: yup.string().required('Name is required'),
    access_permission: yup
      .array()
      .of(yup.string()) // Ensure it's an array of strings
      .min(1, 'At least one permission must be selected') // Ensure at least one permission is selected
      .required('Access Permission is required'),
  });