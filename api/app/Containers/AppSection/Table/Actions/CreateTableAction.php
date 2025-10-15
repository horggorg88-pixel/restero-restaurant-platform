<?php

namespace App\Containers\AppSection\Table\Actions;

use Apiato\Core\Exceptions\IncorrectIdException;
use App\Containers\AppSection\Table\Models\Table;
use App\Containers\AppSection\Table\Tasks\CreateTableTask;
use App\Containers\AppSection\Table\UI\API\Requests\CreateTableRequest;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;

class CreateTableAction extends ParentAction
{
    public function __construct(
        private readonly CreateTableTask $createTableTask,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     * @throws IncorrectIdException
     */
    public function run(CreateTableRequest $request): Table
    {
        $data = $request->sanitizeInput([
            'number',
            'count_people',
            'room_id',
            'comment'
        ]);

        return $this->createTableTask->run($data);
    }
}
