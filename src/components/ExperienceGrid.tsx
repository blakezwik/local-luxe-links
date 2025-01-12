import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"

interface Experience {
  id: string
  viator_id: string
  title: string
  description: string | null
  price: number | null
  image_url: string | null
  destination: string | null
}

interface ExperienceGridProps {
  experiences: Experience[]
  activeCount: number
}

export const ExperienceGrid = ({ experiences, activeCount }: ExperienceGridProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleSelect = async (experience: Experience) => {
    try {
      setLoading(prev => ({ ...prev, [experience.id]: true }))

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to select experiences.",
          duration: 3000,
        })
        return
      }

      if (activeCount >= 10) {
        toast({
          variant: "destructive",
          title: "Maximum Limit Reached",
          description: "You can only have 10 active experiences at a time.",
          duration: 5000,
        })
        return
      }

      const { error } = await supabase
        .from('host_experiences')
        .insert({
          host_id: session.user.id,
          experience_id: experience.id,
          is_active: true
        })

      if (error) {
        if (error.message.includes('Hosts cannot have more than 10 active experiences')) {
          toast({
            variant: "destructive",
            title: "Maximum Limit Reached",
            description: "You can only have 10 active experiences at a time.",
            duration: 5000,
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Experience Selected",
          description: "The experience has been added to your selection.",
          duration: 3000,
        })
      }
    } catch (error: any) {
      console.error('Error selecting experience:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to select experience. Please try again.",
        duration: 5000,
      })
    } finally {
      setLoading(prev => ({ ...prev, [experience.id]: false }))
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {experiences.map((experience) => (
        <Card key={experience.id} className="flex flex-col">
          <CardHeader>
            {experience.image_url && (
              <div className="aspect-video overflow-hidden rounded-lg mb-4">
                <img 
                  src={experience.image_url} 
                  alt={experience.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardTitle className="line-clamp-2">{experience.title}</CardTitle>
            {experience.destination && (
              <CardDescription>{experience.destination}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-3">
              {experience.description}
            </p>
          </CardContent>
          <CardFooter className="mt-auto flex justify-between items-center">
            {experience.price && (
              <p className="text-lg font-semibold">
                From ${experience.price.toFixed(2)}
              </p>
            )}
            <Button 
              onClick={() => handleSelect(experience)}
              disabled={loading[experience.id]}
            >
              {loading[experience.id] ? 'Selecting...' : 'Select Experience'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}