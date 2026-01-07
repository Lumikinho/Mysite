import React, { useState } from "react";
import Modal from "./Modal";

type Skill = {
  name: string;
  description: string;
};

const skillsData: {
  category?: string;
  skills?: string;
  subcategories?: { title: string; skills: string }[];
}[] = [
  {
    category: "Linguagens",
    skills: "python,typescript,javascript,php,html,css",
  },
  {
    category: "Frameworks (Backend/Frontend)",
    skills: "expressjs,reactjs,nodemon",
  },
  {
    category: "Ferramentas",
    skills: "nodejs,xampp,mysql,mariadb,npm,pnpm,gitbash,docker,insomnia",
  },
  {
    category: "Ambiente de Desenvolvimento",
    subcategories: [
      {
        title: "Ide",
        skills: "neovim,vim,visualstudiocode,androidstudio,zed",
      },
      {
        title: "Shells",
        skills: "powershell,bash,gitbash,zshell",
      },
    ],
  },
  {
    category: "Sistemas Operacionais",
    skills: "archlinux,omarchy,windows,android",
  },
  {
    category: "Apps",
    skills:
      "affinity,discord,firefox,zen,blender,figma,virtualbox,notion,warp,canva,perplexity,googlegemini,chatgpt",
  },
];

const allSkills: Skill[] = skillsData
  .flatMap((category) => {
    if (category.skills) {
      return category.skills.split(",").map((skill) => ({
        name: skill,
        description: `Descrição detalhada sobre ${skill}...`,
      }));
    }
    if (category.subcategories) {
      return category.subcategories.flatMap((subcategory) =>
        subcategory.skills.split(",").map((skill) => ({
          name: skill,
          description: `Descrição detalhada sobre ${skill}...`,
        }))
      );
    }
    return [];
  })
  .reduce((acc: Skill[], skill) => {
    if (!acc.find((s) => s.name === skill.name)) {
      acc.push(skill);
    }
    return acc;
  }, []);

const SkillCard = ({
  skill,
  onClick,
}: {
  skill: Skill;
  onClick: () => void;
}) => {
  const iconUrl = `https://skills.syvixor.com/api/icons?i=${skill.name.toLowerCase()}&theme=dark`;
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl overflow-hidden border-2 border-zinc-800 hover:border-zinc-700
              transition-all bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] 
              hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.08)] hover:-translate-y-0.5
              group w-full text-left relative grayscale hover:grayscale-0`}
      aria-controls={`skill-dialog-${skill.name}`}
      aria-expanded={false} // This will be managed by the parent component, but default to false
      aria-haspopup="dialog"
      aria-label={`Open details for ${skill.name}`}
    >
      <div className="relative w-full pt-[80%]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/5 group-hover:to-zinc-950/10 transition-all" />
        <img
          alt={skill.name}
          className="object-cover absolute inset-0 transition-transform group-hover:scale-105 object-center p-2 sm:p-4"
          src={iconUrl}
          width={64}
          height={64}
        />
      </div>
      <div className="p-2 sm:p-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <h2 className="text-base font-semibold mb-1.5 text-zinc-100 capitalize">
          {skill.name}
        </h2>
        {/* <p className="text-sm text-zinc-400/90 leading-relaxed">
          {skill.description}
        </p> */}
      </div>
    </button>
  );
};

export default function Skills() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const openModal = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSkill(null);
  };

  return (
    <div className="h-full w-full flex flex-col p-4 pt-12">
      <div className="max-w-6xl w-full mx-auto">
        <div className="mb-14">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3">
            Minhas Skills e Ferramentas
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-3xl">
            Além do chat básico, aqui estão as tecnologias, ferramentas e
            aplicativos que eu uso no meu dia a dia.
          </p>
        </div>
        <div className="space-y-8">
          {skillsData.map((skillCategory) => (
            <div key={skillCategory.category || "env"}>
              <h2 className="text-sm font-semibold tracking-[0.2em] text-zinc-500 uppercase">
                {skillCategory.category}
              </h2>
              {skillCategory.skills && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4 mt-4">
                  {allSkills
                    .filter((s) =>
                      skillCategory.skills?.split(",").includes(s.name)
                    )
                    .map((skill) => (
                      <SkillCard
                        key={skill.name}
                        skill={skill}
                        onClick={() => openModal(skill)}
                      />
                    ))}
                </div>
              )}
              {skillCategory.subcategories &&
                skillCategory.subcategories.map((subcategory) => (
                  <div key={subcategory.title} className="mt-4">
                    <h3 className="text-xs font-semibold tracking-[0.16em] text-zinc-400 uppercase">
                      {subcategory.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4 mt-2">
                      {allSkills
                        .filter((s) =>
                          subcategory.skills.split(",").includes(s.name)
                        )
                        .map((skill) => (
                          <SkillCard
                            key={skill.name}
                            skill={skill}
                            onClick={() => openModal(skill)}
                          />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedSkill && (
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 capitalize">
              {selectedSkill.name}
            </h2>
            <p className="mt-4 text-zinc-400">{selectedSkill.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

