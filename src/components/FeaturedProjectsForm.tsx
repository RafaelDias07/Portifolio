import { type FormEvent, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorDialog } from '@/components/ui/ErrorDialog'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useFeaturedProjects } from '@/hooks/useFeaturedProjects'
import { useProjects } from '@/hooks/useProjects'
import { useSaveFeaturedProjects } from '@/hooks/useSaveFeaturedProjects'
import styles from './FeaturedProjectsForm.module.css'

// Escolha dos projetos em destaque. Eles aparecem na página inicial e no topo de /projetos,
// na ordem marcada aqui (a primeira caixa marcada vira o primeiro destaque)
export function FeaturedProjectsForm() {
  const projects = useProjects()
  const featured = useFeaturedProjects()
  const save = useSaveFeaturedProjects()
  // null = ainda não mexeu: usa o que está salvo no Supabase
  const [selection, setSelection] = useState<string[] | null>(null)

  if (projects.isPending || featured.isPending) {
    return <ProgressBar label="Carregando projetos" />
  }

  if (projects.isError || featured.isError) {
    return (
      <ErrorDialog
        title="Não foi possível carregar os projetos"
        message="Confira a conexão e tente de novo."
        onRetry={() => {
          projects.refetch()
          featured.refetch()
        }}
      />
    )
  }

  if (projects.data.length === 0) return <EmptyState message="Nenhum projeto para escolher." />

  const selected = selection ?? featured.data

  function toggle(slug: string) {
    save.reset()
    setSelection(
      selected.includes(slug) ? selected.filter((name) => name !== slug) : [...selected, slug],
    )
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    save.mutate(selected, { onSuccess: () => setSelection(null) })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Marque os projetos que aparecem em destaque</legend>
        {projects.data.map((project) => {
          const position = selected.indexOf(project.slug)
          return (
            <label key={project.slug} className={styles.option}>
              <input
                type="checkbox"
                checked={position !== -1}
                onChange={() => toggle(project.slug)}
              />
              <span className={styles.name}>{project.name}</span>
              {position !== -1 && <span className={styles.position}>{position + 1}º</span>}
            </label>
          )
        })}
      </fieldset>

      {save.isError && (
        <ErrorDialog title="Os destaques não foram salvos" message={save.error.message} />
      )}

      <div className={styles.actions}>
        <Button type="submit" disabled={save.isPending || selection === null}>
          {save.isPending ? 'Salvando…' : 'Salvar destaques'}
        </Button>
        {save.isSuccess && (
          <span role="status" className={styles.saved}>
            ✔ Destaques salvos.
          </span>
        )}
      </div>
    </form>
  )
}
