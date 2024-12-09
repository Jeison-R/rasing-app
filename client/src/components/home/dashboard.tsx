'use client'

// import type { ChartConfig } from '@/components/ui/chart'

import { useState, useEffect } from 'react'
import { Activity, CreditCard, Users, User } from 'lucide-react'
// import { TrendingUp } from 'lucide-react'
// import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton' // Asegúrate de importar el Skeleton de Shadcn
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export function Dashboard() {
  const [sumValorSmmlv, setSumValorSmmlv] = useState<number | null>(null)
  const [sumValorSmmlvPart2, setSumValorSmmlvPart2] = useState<number | null>(null)
  const [sumExperiencia, setSumExperiencia] = useState<number | null>(null)
  const [sumValorFinal, setSumValorFinal] = useState<string | null>(null)

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

        const data1 = (await response1.json()) as { sumValorSmmlv: number | null }
        const data2 = (await response2.json()) as { sumValorSmmlvPart2: number | null }
        const data3 = (await response3.json()) as { countExperiencias: number | null }
        const data4 = (await response4.json()) as { sumValorFinalAfectado: number | null }

        setSumValorSmmlv(data1.sumValorSmmlv)
        setSumValorSmmlvPart2(data2.sumValorSmmlvPart2)
        setSumExperiencia(data3.countExperiencias)

        // Asegurarse de que sumValorFinalAfectado no sea null ni undefined
        const sumValorFinalAfectado = data4.sumValorFinalAfectado

        // Formatear el número con puntos de miles, validando que sea un número
        const formattedValue = sumValorFinalAfectado != null ? new Intl.NumberFormat('es-CO').format(sumValorFinalAfectado) : '0' // Valor predeterminado si no hay valor

        setSumValorFinal(formattedValue)
      } catch (error) {
        global.console.error('Error fetching data:', error)
      }
    }

    void fetchData()
  }, [])

  //   const chartData = [
  //     { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  //     { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  //     { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
  //     { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  //     { browser: 'other', visitors: 90, fill: 'var(--color-other)' }
  //   ]
  //
  //   const chartConfig = {
  //     visitors: {
  //       label: 'Visitors'
  //     },
  //     chrome: {
  //       label: 'Chrome',
  //       color: 'hsl(var(--chart-1))'
  //     },
  //     safari: {
  //       label: 'Safari',
  //       color: 'hsl(var(--chart-2))'
  //     },
  //     firefox: {
  //       label: 'Firefox',
  //       color: 'hsl(var(--chart-3))'
  //     },
  //     edge: {
  //       label: 'Edge',
  //       color: 'hsl(var(--chart-4))'
  //     },
  //     other: {
  //       label: 'Other',
  //       color: 'hsl(var(--chart-5))'
  //     }
  //   } satisfies ChartConfig

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
                <div className="text-2xl font-bold">{sumValorSmmlv.toFixed(2)}</div> // Aseguramos que no sea null y usamos toFixed
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
                <div className="text-2xl font-bold">{sumValorSmmlvPart2.toFixed(2)}</div> // Aseguramos que no sea null y usamos toFixed
              )}
            </CardContent>
          </Card>

          {/* Card 3: Sales */}
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Experiencias</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {sumExperiencia === null ? (
                <Skeleton className="h-16 w-full rounded dark:bg-gray-800" />
              ) : (
                <div className="text-2xl font-bold">{sumExperiencia}</div> // Aseguramos que no sea null y mostramos el valor
              )}
            </CardContent>
          </Card>

          {/* Card 4: Active Now */}
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Valor Final Afectado</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {sumValorFinal === null ? (
                <Skeleton className="h-16 w-full rounded dark:bg-gray-800" />
              ) : (
                <div className="text-2xl font-bold">{sumValorFinal}</div> // Aseguramos que no sea null y mostramos el valor
              )}
            </CardContent>
          </Card>
        </div>

        {/* Segunda fila (2 Cards más grandes) */}
        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">

          <Card>
            <CardHeader>
              <CardTitle>Bar Chart - Mixed</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  layout="vertical"
                  margin={{
                    left: 0
                  }}
                >
                  <YAxis axisLine={false} dataKey="browser" tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig].label} tickLine={false} tickMargin={10} type="category" />
                  <XAxis hide dataKey="visitors" type="number" />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                  <Bar dataKey="visitors" layout="vertical" radius={5} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
            </CardFooter>
          </Card>
        </div> */}
      </main>
    </div>
  )
}
