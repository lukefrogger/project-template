"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ 
    queryKey: ["query-1"],
    queryFn: api.signUp.validateLogin("test@test.com"),
    retry: 0,
  });

  return <div>Dashboard</div>;
}
