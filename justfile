DENO_RUN := "deno run -A"

# list the defined tasks
default:
    just list

# build the documentation
build: lenskit-packages torch-packages static-files

# index LensKit packages
lenskit-packages:
    {{DENO_RUN}} lenskit-packages.ts

# index Pytorch packages
torch-packages:
    {{DENO_RUN}} torch-packages.ts

# index static packages
static-files:
    cp -rf static/* out/

