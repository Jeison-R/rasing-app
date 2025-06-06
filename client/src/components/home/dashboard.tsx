'use client'

import type { Experiencia } from '../experiencia/experience-table/interface'

import { useState, useEffect } from 'react'
import { Activity, CreditCard, User, DollarSign } from 'lucide-react'
import { Tooltip, Cell, ResponsiveContainer, PieChart, Pie } from 'recharts'
import CountUp from 'react-countup'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

interface Informacion {
  label: string
  value: string
  type: string
}

export function Dashboard() {
  const [sumValorSmmlv, setSumValorSmmlv] = useState<number | null>(null)
  const [sumValorSmmlvPart2, setSumValorSmmlvPart2] = useState<number | null>(null)
  const [sumExperiencia, setSumExperiencia] = useState<number | null>(null)
  const [sumValorFinal, setSumValorFinal] = useState<number | null>(null)
  const [chartData, setChartData] = useState<{ name: string; Total: number }[]>([])
  const [experiencias, setExperiencias] = useState<Experiencia[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch('https://servidor-vercel-bice.vercel.app/dashboard/sum-valor-smmlv', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        const response2 = await fetch('https://servidor-vercel-bice.vercel.app/dashboard/sum-valor-smmlv-part2', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        const response3 = await fetch('https://servidor-vercel-bice.vercel.app/dashboard/count-experiencias', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        const response4 = await fetch('https://servidor-vercel-bice.vercel.app/dashboard/sumValorFinalAfectado', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        const response5 = await fetch('https://servidor-vercel-bice.vercel.app/dashboard/sumTiposContratos', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })

        const response7 = await fetch('https://servidor-vercel-bice.vercel.app/experiencias/obtenerExperiencia', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
        const data7 = (await response7.json()) as Experiencia[]

        const sortedExperiencias = data7.sort((a: Experiencia, b: Experiencia) => Number(a.rup) - Number(b.rup))

        // Tomar las últimas 3 después del ordenamiento
        const ultimasTres = sortedExperiencias.slice(-3)

        setExperiencias(ultimasTres)

        const data1 = (await response1.json()) as { sumValorSmmlv: number | null }
        const data2 = (await response2.json()) as { sumValorSmmlvPart2: number | null }
        const data3 = (await response3.json()) as { countExperiencias: number | null }
        const data4 = (await response4.json()) as { sumValorFinalAfectado: number | null }
        const data5 = (await response5.json()) as { contractTypeCounts: Record<string, number> }

        setSumValorSmmlv(data1.sumValorSmmlv)
        setSumValorSmmlvPart2(data2.sumValorSmmlvPart2)
        setSumExperiencia(data3.countExperiencias)
        setSumValorFinal(data4.sumValorFinalAfectado)

        const formattedChartData = Object.entries(data5.contractTypeCounts).map(([name, Total]) => ({ name, Total }))

        setChartData(formattedChartData)
      } catch (error) {
        global.console.error('Error fetching data:', error)
      }
    }

    void fetchData()
  }, [])

  const pieColors = ['#4f46e5', '#10b981', '#ef4444', '#8b5cf6', '#3b82f6', '#f59e0b']

  const getTopContractsWithOthers = (data: { name: string; Total: number }[]) => {
    const sorted = [...data].sort((a, b) => b.Total - a.Total)
    const topSix = sorted.slice(0, 6)
    const others = sorted.slice(6)
    const othersTotal = others.reduce((acc, curr) => acc + curr.Total, 0)

    if (othersTotal > 0) {
      topSix.push({ name: 'Otros', Total: othersTotal })
    }

    return topSix
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Valor SMMLV</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {sumValorSmmlv === null ? (
                <Skeleton className="h-16 w-full rounded dark:bg-gray-800" />
              ) : (
                <div className="text-2xl font-bold">
                  <CountUp decimal="," decimals={2} end={sumValorSmmlv} separator="." />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Valor SMMLV Part2</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {sumValorSmmlvPart2 === null ? (
                <Skeleton className="h-16 w-full rounded dark:bg-gray-800" />
              ) : (
                <div className="text-2xl font-bold">
                  <CountUp decimal="," decimals={2} end={sumValorSmmlvPart2} separator="." />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Experiencias</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {sumExperiencia === null ? (
                <Skeleton className="h-16 w-full rounded dark:bg-gray-800" />
              ) : (
                <div className="text-2xl font-bold">
                  <CountUp end={sumExperiencia} separator="." />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Valor Final Afectado</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {sumValorFinal === null ? (
                <Skeleton className="h-16 w-full rounded dark:bg-gray-800" />
              ) : (
                <div className="text-2xl font-bold">
                  <CountUp decimal="," end={sumValorFinal} separator="." />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-row gap-4">
          <Card className="w-1/3">
            <CardHeader>
              <CardTitle>Distribución de Tipos de Contrato</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <Skeleton className="h-[300px] w-full rounded dark:bg-gray-800" />
              ) : (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer height="100%" width="100%">
                    <PieChart>
                      <Pie
                        cx="50%"
                        cy="50%"
                        data={getTopContractsWithOthers(chartData)}
                        dataKey="Total"
                        innerRadius={60}
                        label={(entry: { name: string; percent: number }) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                        labelLine={false}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {getTopContractsWithOthers(chartData).map((entry) => (
                          <Cell key={entry.name} fill={pieColors[pieColors.indexOf(entry.name)]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value} contratos`, 'Cantidad']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-2/3">
            <CardHeader>
              <CardTitle>Últimas Experiencias agregadas</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
              {experiencias.length === 0 ? (
                <Skeleton className="h-64 w-full rounded dark:bg-gray-800" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>RUP</TableHead>
                      <TableHead>Datos Numéricos</TableHead>
                      <TableHead className="w-1/2">Objeto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experiencias.map((exp) => {
                      const datosNumericos = exp.informacion?.filter((info: Informacion) => info.type === 'numeric') || []

                      return (
                        <TableRow key={exp.id}>
                          <TableCell className="text-xs capitalize">{exp.rup}</TableCell>
                          <TableCell className="text-xs capitalize">
                            {datosNumericos.map((item: Informacion) => (
                              <div key={item.label}>
                                <strong>{item.label}:</strong> {item.value}
                              </div>
                            ))}
                          </TableCell>
                          <TableCell className="text-xs capitalize"> {exp.objeto ? exp.objeto.charAt(0).toUpperCase() + exp.objeto.slice(1) : 'Sin objeto'}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
