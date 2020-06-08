export default class Helper
{
    public static stringIsEmpty(str: string)
    {
        if (!str || str.length === 0)
            return true;
        
        return false;
    }
}