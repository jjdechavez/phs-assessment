import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Avatar, AvatarInitials, generateTextInitials } from "./base/avatar";
import type { Project } from "../types/project";
import { projectURL } from "../data/projects";
import { Spinner } from "./base/spinner";

export function ProjectList() {
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState<string | null>(null);
  const [searchQuery] = useDebounce(searchName, 1200);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    let initialFetch = false;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(projectURL.toString());
        const data: { data: Array<Project> } = await response.json();
        setProjects(data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!initialFetch) {
      fetchProjects();
    }
    return () => {
      initialFetch = true;
    };
  }, []);

  useEffect(() => {
    const searchProjects = async (search: string | null) => {
      try {
        if (search && search.length > 0) {
          projectURL.searchParams.set("s", search);
        } else {
          projectURL.searchParams.delete("s");
        }

        const response = await fetch(projectURL.toString());
        const data: { data: Array<Project> } = await response.json();
        setProjects(data.data);
      } catch (error) {
        console.error("Error searching projects:", error);
      } finally {
        setIsSearching(false);
      }
    };

    if (searched) {
      searchProjects(searchQuery);
    }
  }, [searchQuery, searched]);

  let projectContent = null;
  if (loading) {
    projectContent = (
      <>
        <ProjectItemSkeleton />
        <ProjectItemSkeleton />
        <ProjectItemSkeleton />
      </>
    );
  } else if (searched && projects.length === 0) {
    projectContent = <ProjectItemEmpty type="search" />;
  } else {
    projectContent = projects.map((project) => (
      <ProjectItem key={project.id.toString()} project={project} />
    ));
  }

  let searchContent = null;
  if (isSearching) {
    searchContent = <Spinner />;
  }

  return (
    <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col gap-4 items-start align-start justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          List of Projects
        </h5>
        <div className="sm:col-span-4">
          <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-600">
            <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
              Search project:{" "}
            </div>
            <input
              id="project-name"
              name="project-name"
              type="text"
              placeholder="alpha"
              className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              value={searchName ?? ""}
              onChange={(e) => {
                setSearched(true);
                setIsSearching(true);
                setSearchName(e.target.value);
              }}
            />
            {searchContent}
          </div>
        </div>
      </div>

      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {projectContent}
        </ul>
      </div>
    </div>
  );
}

type ProjectItemProps = {
  project: Project;
};

export function ProjectItem(props: ProjectItemProps) {
  return (
    <li key={props.project.id.toString()} className="py-3 sm:py-4">
      <div className="flex items-center">
        <Avatar>
          <AvatarInitials>
            {generateTextInitials(props.project.name)}
          </AvatarInitials>
        </Avatar>

        <div className="flex-1 min-w-0 ms-4">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {props.project.name}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {props.project.description}
          </p>
        </div>

        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          View
        </a>
      </div>
    </li>
  );
}

function ProjectItemSkeleton() {
  return (
    <li className="py-3 sm:py-4">
      <div className="flex items-center">
        <Avatar>
          <AvatarInitials>{generateTextInitials("A B")}</AvatarInitials>
        </Avatar>

        <div className="flex-1 min-w-0 ms-4">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
          <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>

        <div className="w-8 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
    </li>
  );
}

type ProjectItemEmptyProps = {
  type: "search" | "fetched";
};

function ProjectItemEmpty(props: ProjectItemEmptyProps) {
  let content = "Empty projects";
  if (props.type === "search") {
    content = "No projects found";
  }
  return (
    <li className="py-3 sm:py-4">
      <div className="flex items-center">
        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
          {content}
        </p>
      </div>
    </li>
  );
}
