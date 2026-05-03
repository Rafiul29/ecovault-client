import { Metadata } from "next";
import { Leaf, Users, Zap, Globe, Target, Award } from "lucide-react";

export const metadata: Metadata = {
   title: "About Us | EcoVault",
   description: "Learn more about EcoVault, our mission, and the team behind the platform.",
};

export default function AboutPage() {
   return (
      <div className="pb-20">
         <div className="bg-muted/30 py-10 md:py-16">
            <div className="wrapper text-center">
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  About <span className="text-primary">EcoVault</span>
               </h1>
               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We are a community-driven platform dedicated to accelerating the transition to a sustainable future by connecting innovators, supporters, and capital.
               </p>
            </div>
         </div>

         <div className="wrapper mt-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="space-y-6">
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                     The world faces accelerating environmental challenges — climate change, biodiversity loss, pollution, and resource depletion. Many people have innovative solutions but lack a platform to share them, get feedback, and attract funding.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                     EcoVault was created to solve this gap. Our mission is to give every eco-conscious individual a voice, build a collaborative community, and connect promising innovations with resources to turn concepts into real-world impact.
                  </p>
               </div>
               <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-3 text-center">
                        <div className="size-12 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                           <Users className="size-6" />
                        </div>
                        <h3 className="font-semibold text-2xl">10k+</h3>
                        <p className="text-sm text-muted-foreground">Active Members</p>
                     </div>
                     <div className="space-y-3 text-center">
                        <div className="size-12 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                           <Zap className="size-6" />
                        </div>
                        <h3 className="font-semibold text-2xl">500+</h3>
                        <p className="text-sm text-muted-foreground">Ideas Shared</p>
                     </div>
                     <div className="space-y-3 text-center">
                        <div className="size-12 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                           <Globe className="size-6" />
                        </div>
                        <h3 className="font-semibold text-2xl">50+</h3>
                        <p className="text-sm text-muted-foreground">Countries</p>
                     </div>
                     <div className="space-y-3 text-center">
                        <div className="size-12 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                           <Award className="size-6" />
                        </div>
                        <h3 className="font-semibold text-2xl">$2M+</h3>
                        <p className="text-sm text-muted-foreground">Funded</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="wrapper mt-24">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold">Our Core Values</h2>
               <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                  The principles that guide our community and platform development.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
                  <div className="size-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                     <Leaf className="size-5" />
                  </div>
                  <h3 className="font-semibold text-xl">Sustainability First</h3>
                  <p className="text-muted-foreground">
                     Every action, feature, and decision we make prioritizes long-term environmental health over short-term gains.
                  </p>
               </div>
               <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
                  <div className="size-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                     <Users className="size-5" />
                  </div>
                  <h3 className="font-semibold text-xl">Community Driven</h3>
                  <p className="text-muted-foreground">
                     We believe the best solutions come from collaboration. Our platform thrives on the shared wisdom of our members.
                  </p>
               </div>
               <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
                  <div className="size-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                     <Target className="size-5" />
                  </div>
                  <h3 className="font-semibold text-xl">Action Oriented</h3>
                  <p className="text-muted-foreground">
                     Ideas are just the beginning. We focus on connecting creators with the funding and resources needed for real implementation.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
