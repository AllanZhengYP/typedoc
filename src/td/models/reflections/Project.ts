module td.models
{
    /**
     * A reflection that represents the root of the project.
     *
     * The project reflection acts as a global index, one may receive all reflections
     * and source files of the processed project through this reflection.
     */
    export class ProjectReflection extends Container
    {
        /**
         * A list of all reflections within the project.
         */
        reflections:Reflection[] = [];

        /**
         * The root directory of the project.
         */
        directory:SourceDirectory = new SourceDirectory();

        /**
         * A list of all source files within the project.
         */
        files:SourceFile[] = [];

        /**
         * The contents of the readme.md file of the project when found.
         */
        readme:string;

        /**
         * The parsed data of the package.json file of the project when found.
         */
        packageInfo:any;


        /**
         * Create a new ProjectReflection instance.
         *
         * @param name  The name of the project.
         */
        constructor(name:string) {
            super();
            this.name = name;
        }


        /**
         * Return a list of all reflections in this project of a certain kind.
         *
         * @param kind  The desired kind of reflection.
         * @returns     An array containing all reflections with the desired kind.
         */
        getReflectionsByKind(kind:ts.SyntaxKind):Reflection[] {
            var values = [];
            this.reflections.forEach((reflection) => {
                if (reflection.kindOf(kind)) {
                    values.push(reflection);
                }
            });
            return values;
        }


        /**
         * @param name  The name to look for. Might contain a hierarchy.
         */
        findReflectionByName(name:string):Reflection;

        /**
         * @param names  The name hierarchy to look for.
         */
        findReflectionByName(names:string[]):Reflection;

        /**
         * Try to find a reflection by its name.
         *
         * @return The found reflection or null.
         */
        findReflectionByName(arg:any):Reflection {
            var names:string[] = Array.isArray(arg) ? arg : arg.split('.');
            var name = names.pop();

            search: for (var index = 0, length = this.reflections.length; index < length; index++) {
                var reflection = this.reflections[index];
                if (reflection.name != name) continue;

                var depth = names.length - 1;
                var target = reflection;
                while (target && depth > 0) {
                    target = target.parent;
                    if (target.name != names[depth]) continue search;
                    depth -= 1;
                }

                return reflection;
            }

            return null;
        }
    }
}