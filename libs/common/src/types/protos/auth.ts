// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.0.2
//   protoc               v3.20.3
// source: protos/auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface LoginArgs {
  email: string;
  password: string;
}

export interface SignUpArgs {
  name: string;
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  isActivated: boolean;
}

export interface AuthReturns {
  tokens: Tokens | undefined;
  user: User | undefined;
}

export interface RefreshArgs {
  refreshToken: string;
}

export interface RefreshReturns {
  tokens: Tokens | undefined;
  user: User | undefined;
}

export interface EmptyAuth {
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  login(request: LoginArgs): Observable<AuthReturns>;

  signUp(request: SignUpArgs): Observable<AuthReturns>;

  logOut(request: EmptyAuth): Observable<EmptyAuth>;

  refresh(request: RefreshArgs): Observable<RefreshReturns>;
}

export interface AuthServiceController {
  login(request: LoginArgs): Promise<AuthReturns> | Observable<AuthReturns> | AuthReturns;

  signUp(request: SignUpArgs): Promise<AuthReturns> | Observable<AuthReturns> | AuthReturns;

  logOut(request: EmptyAuth): Promise<EmptyAuth> | Observable<EmptyAuth> | EmptyAuth;

  refresh(request: RefreshArgs): Promise<RefreshReturns> | Observable<RefreshReturns> | RefreshReturns;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["login", "signUp", "logOut", "refresh"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
