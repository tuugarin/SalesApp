	CREATE PROCEDURE [dbo].[GetSales]
	-- Add the parameters for the stored procedure here
	@SearchText nvarchar(max),
	@page int,
	@pageSize int,
	@orderDirection int /*0 - ASC, 1 - DESC*/
	,@total bigint = 0 out 
	AS
		BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- Insert statements for procedure here
	Select * from (Select * , ROW_NUMBER() OVER (ORDER BY 
	CASE WHEN  @orderDirection = 1 THEN OrderDate END DESC,
	CASE WHEN  @orderDirection = 0 THEN OrderDate END ASC) AS RowNumber
	from SalesRecords s where Country like (N'%'+@SearchText+'%')	) as subquery
	where RowNumber BETWEEN ((@page-1) * @pageSize+1) AND (@page * @pageSize)

	Select @total = COUNT(ID)
	from SalesRecords where Country like (N'%'+@SearchText+'%')
	END
	