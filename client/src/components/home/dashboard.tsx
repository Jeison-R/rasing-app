'use client'

import { useState, useEffect } from 'react'
import { Activity, CreditCard, Users, User } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function Dashboard() {
  const [sumValorSmmlv, setSumValorSmmlv] = useState<number | null>(null)
  const [sumValorSmmlvPart2, setSumValorSmmlvPart2] = useState<number | null>(null)
  const [sumExperiencia, setSumExperiencia] = useState<number | null>(null)
  const [sumValorFinal, setSumValorFinal] = useState<string | null>(null)
  const [chartData, setChartData] = useState<{ name: string; Total: number }[]>([])
  const [chartDataAct, setChartDataAct] = useState<{ name: string; Total: number }[]>([])

  // Obtener los datos desde la API cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch('https://servidor-rasing.onrender.com/dashboard/sum-valor-smmlv', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        const response2 = await fetch('https://servidor-rasing.onrender.com/dashboard/sum-valor-smmlv-part2', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        const response3 = await fetch('https://servidor-rasing.onrender.com/dashboard/count-experiencias', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        const response4 = await fetch('https://servidor-rasing.onrender.com/dashboard/sumValorFinalAfectado', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        const response5 = await fetch('https://servidor-rasing.onrender.com/dashboard/sumTiposContratos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        const response6 = await fetch('https://servidor-rasing.onrender.com/dashboard/sumActividadesPrincipales', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        const data1 = (await response1.json()) as { sumValorSmmlv: number | null }
        const data2 = (await response2.json()) as { sumValorSmmlvPart2: number | null }
        const data3 = (await response3.json()) as { countExperiencias: number | null }
        const data4 = (await response4.json()) as { sumValorFinalAfectado: number | null }
        const data5 = (await response5.json()) as { contractTypeCounts: Record<string, number> }
        const data6 = (await response6.json()) as { activityTypeCounts: Record<string, number> }

        setSumValorSmmlv(data1.sumValorSmmlv)
        setSumValorSmmlvPart2(data2.sumValorSmmlvPart2)
        setSumExperiencia(data3.countExperiencias)

        // Asegurarse de que sumValorFinalAfectado no sea null ni undefined
        const sumValorFinalAfectado = data4.sumValorFinalAfectado

        // Formatear el número con puntos de miles, validando que sea un número
        const formattedValue = sumValorFinalAfectado != null ? new Intl.NumberFormat('es-CO').format(sumValorFinalAfectado) : '0' // Valor predeterminado si no hay valor

        setSumValorFinal(formattedValue)

        const formattedChartData = Object.entries(data5.contractTypeCounts).map(([name, Total]) => ({
          name,
          Total
        }))

        setChartData(formattedChartData)

        const formattedChartDataAct = Object.entries(data6.activityTypeCounts).map(([name, Total]) => ({
          name,
          Total
        }))

        setChartDataAct(formattedChartDataAct)
      } catch (error) {
        global.console.error('Error fetching data:', error)
      }
    }

    void fetchData()
  }, [])

  const colors = [
    '#4A90E2', // Color para Contrato A
    '#50E3C2', // Color para Contrato B
    '#F5A623', // Color para Contrato C
    '#D0021B', // Color para Contrato D
    '#9013FE' // Color para Contrato E
  ]

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-4">
          {/* Card 1: Total Valor SMMLV */}
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Valor SMMLV</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {sumValorSmmlv === null ? (
                <Skeleton className="h-16 w-full rounded dark:bg-gray-800" />
              ) : (
                (() => {
                  const formatted = new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP'
                  }).format(sumValorSmmlv)

                  const formattedWithoutSymbol = formatted.replace(/[^0-9.,]/g, '')

                  return <div className="text-2xl font-bold">{formattedWithoutSymbol}</div>
                })()
              )}
            </CardContent>
          </Card>

          {/* Card 2: Total Valor SMMLV Part2 */}
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Valor SMMLV Part2</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {sumValorSmmlvPart2 === null ? (
                <Skeleton className="h-16 w-full rounded dark:bg-gray-800" />
              ) : (
                (() => {
                  const formatted = new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP'
                  }).format(sumValorSmmlvPart2)

                  const formattedWithoutSymbol = formatted.replace(/[^0-9.,]/g, '')

                  return <div className="text-2xl font-bold">{formattedWithoutSymbol}</div>
                })()
              )}
            </CardContent>
          </Card>

          {/* Card 3: Sales */}
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Experiencias</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>{sumExperiencia === null ? <Skeleton className="h-16 w-full rounded dark:bg-gray-800" /> : <div className="text-2xl font-bold">{sumExperiencia}</div>}</CardContent>
          </Card>

          {/* Card 4: Active Now */}
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Valor Final Afectado</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>{sumValorFinal === null ? <Skeleton className="h-16 w-full rounded dark:bg-gray-800" /> : <div className="text-2xl font-bold">{sumValorFinal}</div>}</CardContent>
          </Card>
        </div>

        {/* Gráfico de barras horizontal */}

        <Card>
          <CardHeader>
            <CardTitle>Total de cada tipo de Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <Skeleton className="h-64 w-full rounded dark:bg-gray-800" />
            ) : (
              <ResponsiveContainer height={280} width="100%">
                <BarChart data={chartData} margin={{ bottom: 65 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis angle={-45} dataKey="name" interval={0} textAnchor="end" type="category" />
                  <YAxis type="number" />
                  <Tooltip />
                  <Bar dataKey="Total">
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total de cada Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            {chartDataAct.length === 0 ? (
              <Skeleton className="h-64 w-full rounded dark:bg-gray-800" />
            ) : (
              <ResponsiveContainer height={280} width="100%">
                <BarChart data={chartDataAct} margin={{ bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis angle={-45} dataKey="name" interval={0} textAnchor="end" type="category" />
                  <YAxis type="number" />
                  <Tooltip />
                  <Bar dataKey="Total">
                    {chartDataAct.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
