pipeline {
    environment {
        registry = "linea/polaris"
        registryCredential = 'Dockerhub'
        dockerImage = ''
        deployment = 'polaris'
        namespace = 'scienceportal-dev'
        namespace_prod = 'scienceportal'
    }
    agent any

    stages {
        stage('Testing') {
            steps {
                sh 'yarn install'
                sh 'yarn lint'
                sh 'yarn test'
            }
        }
        stage('Creating version.json') {
            steps {
                sh './version.sh && cat ./src/assets/json/version.json'
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
                    https://fox.linea.gov.br/api/1/job/9c6e3723-2a44-4d03-bb94-67185b9c00b3/executions
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
                    https://fox.linea.gov.br/api/1/job/9c6e3723-2a44-4d03-bb94-67185b9c00b3/executions
                  """
            }
        }
    }
  }
}
