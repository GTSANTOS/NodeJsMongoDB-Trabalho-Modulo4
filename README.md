# NodeJsMongoDB-Trabalho-Modulo4
Trabalho com Nodejs e MongoDb do módulo4

# NodeJsMongoDB-Trabalho-Modulo4
Trabalho com Nodejs e MongoDb do m?dulo4

O aluno dever? implementar uma API integrada ao MongoDB Atlas cujo o schema dos
dados ser? definido pelo mongoose. Esta API ter? alguns endpoints para manipula??o dos
dados.

Atividades
O aluno dever? baixar o arquivo com os dados para a carga inicial na base de dados e
desempenhar as seguintes atividades:

1. Criar um banco de dados no MongoDB Atlas, uma cole??o e importar os dados
arquivo ?accounts.json? em sua cole??o.

2. Implementar um modelo (schema) para esta cole??o, considerando que todos os
campos s?o requeridos e o campo balance n?o pode ser menor que 0.

3. Criar o projeto my-bank-api para implementa??o dos endpoints.

4. Crie um endpoint para registrar um dep?sito em uma conta. Este endpoint dever?
receber como par?metros a ?agencia?, o n?mero da ?conta? e o valor do dep?sito.
Ele dever? atualizar o ?balance? da conta, incrementando-o com o valor recebido
como par?metro. O endpoint dever? validar se a conta informada existe, caso n?o
exista dever? retornar um erro, caso exista retornar o saldo atual da conta.

5. Crie um endpoint para registrar um saque em uma conta. Este endpoint dever?
receber como par?metros a ?ag?ncia?, o n?mero da ?conta? e o valor do saque. Ele
dever? atualizar o ?balance? da conta, decrementando-o com o valor recebido com
par?metro e cobrando uma tarifa de saque de (1). O endpoint dever? validar se a
conta informada existe, caso n?o exista dever? retornar um erro, caso exista retornar
o saldo atual da conta. Tamb?m dever? validar se a conta possui saldo suficiente
para aquele saque, se n?o tiver dever? retornar um erro, n?o permitindo assim que
o saque fique negativo.

6. Crie um endpoint para consultar o saldo da conta. Este endpoint dever? receber
como par?metro a ?ag?ncia? e o n?mero da ?conta?, e dever? retornar seu ?balance?.
Caso a conta informada n?o exista, retornar um erro.

7. Crie um endpoint para excluir uma conta. Este endpoint dever? receber como
par?metro a ?ag?ncia? e o n?mero da ?conta? da conta e retornar o n?mero de contas
ativas para esta ag?ncia.

8. Crie um endpoint para realizar transfer?ncias entre contas. Este endpoint dever?
receber como par?metro o n?mero da ?conta? origem, o n?mero da ?conta? destino e
o valor de transfer?ncia. Este endpoint deve validar se as contas s?o da mesma
ag?ncia para realizar a transfer?ncia, caso seja de ag?ncias distintas o valor de tarifa
de transferencia (8) deve ser debitado na ?conta? origem. O endpoint dever? retornar
o saldo da conta origem.

9. Crie um endpoint para consultar a m?dia do saldo dos clientes de determinada
ag?ncia. O endpoint dever? receber como parametro a ?ag?ncia? e dever? retornar
o balance m?dio da conta.

10. Crie um endpoint para consultar os clientes com o menor saldo em conta. O endpoint
devera receber como par?metro um valor num?rico para determinar a quantidade de
clientes a serem listados, e o endpoint dever? retornar em ordem crescente pelo
saldo a lista dos clientes (ag?ncia, conta, saldo).

11. Crie um endpoint para consultar os clientes mais ricos do banco. O endpoint dever?
receber como par?metro um valor num?rico para determinar a quantidade de clientes
a serem listados, e o endpoint dever? retornar em ordem decrescente pelo saldo,
crescente pelo nome, a lista dos clientes (ag?ncia, conta, nome e saldo).

12. Crie um endpoint que ir? transferir o cliente com maior saldo em conta de cada
ag?ncia para a ag?ncia private agencia=99. O endpoint dever? retornar a lista dos
clientes da agencia private.

