pipeline {
    environment {
        registry = "linea/polaris"
        registryCredential = 'Dockerhub'
        dockerImage = ''
        deployment = 'polaris'
        namespace = 'scienceportal-dev'
        namespace_prod = 'scienceportal'
        version = gitTagName()
    }

    agent any

    String gitTagName() {
        commit = getCommit()
        if (commit) {
            desc = sh(script: "git describe --tags ${commit}", returnStdout: true)?.trim()
            if (isTag(desc)) {
                return desc
            }
        }
        return null
    }

    String getCommit() {
        return sh(script: 'git rev-parse HEAD', returnStdout: true)?.trim()
    }
    
    @NonCPS
    boolean isTag(String desc) {
        match = desc =~ /.+-[0-9]+-g[0-9A-Fa-f]{6,}$/
        result = !match
        match = null // prevent serialisation
        return result
    }

    stages {
        stage('Test') {
            steps {
                sh 'yarn install'
                sh 'yarn lint'
                sh 'yarn test'
                sh 'echo "VERSION:"'
                sh 'echo $version'
            }
        }
        stage('Building and push image') {
            when {
                allOf {
                    expression {
                        env.TAG_NAME == null
                    }
                    expression {
                        env.BRANCH_NAME.toString().equals('master')
                    }
                }
            }
            steps {
                script {

                sh 'docker build -t $registry:$GIT_COMMIT .'
                docker.withRegistry( '', registryCredential ) {
                    sh 'docker push $registry:$GIT_COMMIT'
                    sh 'docker rmi $registry:$GIT_COMMIT'
                }
                sh """
                  curl -D - -X \"POST\" \
                    -H \"content-type: application/json\" \
                    -H \"X-Rundeck-Auth-Token: $RD_AUTH_TOKEN\" \
                    -d '{\"argString\": \"-namespace $namespace -image $registry:$GIT_COMMIT -deployment $deployment\"}' \
                    https://fox.linea.gov.br/api/1/job/e79ea1f7-e156-4992-98b6-75995ac4c15a/executions
                  """
                }
            }
        }
        stage('Building and Push Image Release') {
            when {
                expression {
                    env.TAG_NAME != null
                }
            }
            steps {
                script {
                sh 'docker build -t $registry:$TAG_NAME .'
                docker.withRegistry( '', registryCredential ) {
                    sh 'docker push $registry:$TAG_NAME'
                    sh 'docker rmi $registry:$TAG_NAME'
                }

                sh """
                  curl -D - -X \"POST\" \
                    -H \"content-type: application/json\" \
                    -H \"X-Rundeck-Auth-Token: $RD_AUTH_TOKEN\" \
                    -d '{\"argString\": \"-namespace $namespace_prod -image $registry:$TAG_NAME -deployment $deployment\"}' \
                    https://fox.linea.gov.br/api/1/job/e79ea1f7-e156-4992-98b6-75995ac4c15a/executions
                  """
            }
        }
    }
  }
}
