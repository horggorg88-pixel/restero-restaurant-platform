<?php

namespace App\Containers\AppSection\Table\Actions;

use Apiato\Core\Exceptions\IncorrectIdException;
use App\Containers\AppSection\Table\Models\Table;
use App\Containers\AppSection\Table\Tasks\UpdateTableTask;
use App\Containers\AppSection\Table\UI\API\Requests\UpdateTableRequest;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;

class UpdateTableAction extends ParentAction
{
    public function __construct(
        private readonly UpdateTableTask $updateTableTask,
    ) {
    }

    /**
     * @throws UpdateResourceFailedException
     * @throws IncorrectIdException
     * @throws NotFoundException
     */
    public function run(UpdateTableRequest $request): Table
    {
        $data = $request->sanitizeInput([
            'number',
            'count_people',
            'room_id',
            'comment'
        ]);

        return $this->updateTableTask->run($data, $request->id);
    }
}
