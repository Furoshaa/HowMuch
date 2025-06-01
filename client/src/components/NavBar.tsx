import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAlert } from "@/components/ui/alert-context";
import { useAuth } from "@/hooks/useAuth";

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { addAlert } = useAlert();    const { user, logout, isLoading } = useAuth();

    // Debug log to see if NavBar re-renders
    console.log('📋 NavBar render - user:', user, 'isLoading:', isLoading);

    // Force re-render when user state changes
    useEffect(() => {
        console.log('📋 NavBar useEffect - user changed:', user);
    }, [user]);

    const handleLogout = () => {
        logout();
        addAlert({
            type: 'info',
            title: 'Logged Out',
            message: 'You have been successfully logged out.',
            duration: 4000
        });
        navigate('/');
    };
    
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                {/* Brand */}
                <div className="mr-6 flex items-center space-x-2">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-clip-text pl-5">
                            HowMuch
                        </span>
                    </Link>
                </div>
                
                {/* Main Navigation */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    location.pathname === '/' && "bg-accent text-accent-foreground"
                                )}
                            >
                                <Link to="/">Home</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        
                        {user && (
                            <NavigationMenuItem>
                                <NavigationMenuTrigger 
                                    className={location.pathname.startsWith('/users') || location.pathname.startsWith('/schedules') || location.pathname.startsWith('/dashboard') ? "bg-accent text-accent-foreground" : ""}
                                >
                                    Dashboard
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                    to="/"
                                                >
                                                    <div className="mb-2 mt-4 text-lg font-medium">
                                                        HowMuch
                                                    </div>
                                                    <p className="text-sm leading-tight text-muted-foreground">
                                                        See how much you're earning in real time.
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/dashboard"
                                                    className={cn(
                                                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                                        location.pathname === '/dashboard' && "bg-accent text-accent-foreground"
                                                    )}
                                                >
                                                    <div className="text-sm font-medium leading-none">Dashboard</div>
                                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                        Your personal dashboard and overview
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/users"
                                                    className={cn(
                                                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                                        location.pathname === '/users' && "bg-accent text-accent-foreground"
                                                    )}
                                                >
                                                    <div className="text-sm font-medium leading-none">Users</div>
                                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                        Manage user accounts and profiles
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    to="/schedules"
                                                    className={cn(
                                                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                                        location.pathname === '/schedules' && "bg-accent text-accent-foreground"
                                                    )}
                                                >
                                                    <div className="text-sm font-medium leading-none">Schedules</div>
                                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                        View and manage work schedules
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        )}
                        
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    location.pathname === '/test' && "bg-accent text-accent-foreground"
                                )}
                            >
                                <Link to="/test">Test</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                
                {/* Mobile Navigation */}
                <div className="flex md:hidden mr-4">
                    <select 
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={location.pathname}
                        onChange={(e) => navigate(e.target.value)}
                    >
                        <option value="/">Home</option>
                        {user && <option value="/dashboard">Dashboard</option>}
                        <option value="/users">Users</option>
                        <option value="/schedules">Schedules</option>
                        <option value="/test">Test</option>
                    </select>
                </div>
                  {/* Auth Buttons */}
                <div className="flex flex-1 items-center justify-end space-x-2 pr-4">
                    {isLoading ? (
                        // Loading state
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                            <span className="text-sm text-muted-foreground">Loading...</span>
                        </div>
                    ) : user ? (
                        // Logged in state
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-muted-foreground">
                                Welcome, <span className="font-medium text-foreground">{user.firstname || user.name || user.email}</span>
                            </span>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        // Not logged in state
                        <>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                asChild
                                className={location.pathname === '/login' ? "bg-accent text-accent-foreground" : ""}
                            >
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button 
                                size="sm"
                                asChild
                                className={location.pathname === '/register' ? "bg-primary/90" : ""}
                            >
                                <Link to="/register">Register</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default NavBar;